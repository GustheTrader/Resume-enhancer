
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { decryptApiKey } from "@/lib/crypto";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const ENHANCEMENT_PROMPTS = {
  skills_certifications: `You are enhancing a resume for HOME SERVICES and TRADESMEN professionals. Focus on highlighting technical skills, certifications, and qualifications relevant to the trades.

CRITICAL OUTPUT REQUIREMENTS:
- Output ONLY the resume content - NO code fences, NO markdown tags, NO backticks
- DO NOT include \`\`\`markdown or \`\`\` in your response
- Use actual information from the resume - DO NOT use placeholders like [Your Name] or [X years]
- Keep all real names, dates, companies, and numbers from the original resume
- Use proper Markdown formatting with **bold text** for emphasis
- Use **bold** for: Names, Job Titles, Company Names, Section Headers, Key Skills, Certifications, License Numbers
- Use # for main headers, ## for section headers
- Use bullet points (- ) for lists
- Include quantifiable achievements with numbers in **bold**

Enhancement Focus:
- Emphasize trade-specific skills (plumbing, electrical, HVAC, carpentry, roofing, etc.)
- Highlight all licenses, certifications, and safety training (OSHA, EPA, state licenses)
- Include specialized equipment and tool proficiencies
- Add relevant technical competencies and specializations
- Showcase any apprenticeship or vocational training
- Include union memberships or professional affiliations

Output the enhanced resume content in clean Markdown format with extensive use of **bold formatting** for key information. Make it professional, impactful, and perfect for home services and trades positions.`,

  project_experience: `You are enhancing a resume for HOME SERVICES and TRADESMEN professionals. Focus on showcasing hands-on project experience, completed work, and technical expertise.

CRITICAL OUTPUT REQUIREMENTS:
- Output ONLY the resume content - NO code fences, NO markdown tags, NO backticks
- DO NOT include \`\`\`markdown or \`\`\` in your response
- Use actual information from the resume - DO NOT use placeholders like [Your Name] or [X years]
- Keep all real names, dates, companies, and numbers from the original resume
- Use proper Markdown formatting with **bold text** for emphasis
- Use **bold** for: Names, Job Titles, Company Names, Section Headers, Project Types, Measurable Results
- Use # for main headers, ## for section headers
- Use bullet points (- ) for achievements and responsibilities
- Include quantifiable results with numbers in **bold** (sq ft, $ value, time saved, etc.)

Enhancement Focus:
- Highlight specific projects completed (residential, commercial, industrial)
- Quantify work scope: square footage, property values, project budgets, completion times
- Emphasize problem-solving abilities and troubleshooting skills
- Include experience with inspections, estimates, and project planning
- Showcase ability to work independently or lead teams
- Mention customer-facing experience and site management
- Add any emergency service or on-call experience

Output the enhanced resume content in clean Markdown format with extensive use of **bold formatting** for key information. Make it professional, results-driven, and perfect for home services and trades positions.`,

  client_quality: `You are enhancing a resume for HOME SERVICES and TRADESMEN professionals. Focus on demonstrating quality workmanship, client satisfaction, and professional reliability.

CRITICAL OUTPUT REQUIREMENTS:
- Output ONLY the resume content - NO code fences, NO markdown tags, NO backticks
- DO NOT include \`\`\`markdown or \`\`\` in your response
- Use actual information from the resume - DO NOT use placeholders like [Your Name] or [X years]
- Keep all real names, dates, companies, and numbers from the original resume
- Use proper Markdown formatting with **bold text** for emphasis
- Use **bold** for: Names, Job Titles, Company Names, Section Headers, Customer Ratings, Quality Metrics
- Use # for main headers, ## for section headers
- Use bullet points (- ) for achievements and testimonials
- Include quantifiable metrics with numbers in **bold** (satisfaction rates, repeat clients, ratings, etc.)

Enhancement Focus:
- Highlight customer satisfaction rates, positive reviews, and testimonials
- Emphasize quality workmanship and attention to detail
- Include warranty compliance and code adherence experience
- Showcase repeat business and referral rates
- Mention safety record and zero-accident achievements
- Add communication skills and customer service abilities
- Include reliability metrics (on-time completion, within budget, etc.)
- Highlight problem resolution and customer issue management

Output the enhanced resume content in clean Markdown format with extensive use of **bold formatting** for key information. Make it professional, customer-focused, and perfect for home services and trades positions.`
};

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { enhancementType } = await req.json();

    if (!enhancementType || !ENHANCEMENT_PROMPTS[enhancementType as keyof typeof ENHANCEMENT_PROMPTS]) {
      return NextResponse.json(
        { message: "Invalid enhancement type" },
        { status: 400 }
      );
    }

    // Get the resume
    const resume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    // Get user's active API keys
    const apiKeys = await prisma.userApiKey.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    // Use Abacus AI fallback if no user API keys are configured
    let apiKey = apiKeys.length > 0 ? apiKeys[0] : null;
    let decryptedKey = apiKey ? decryptApiKey(apiKey.encryptedKey) : null;
    
    // Get the default model or use a fallback
    let defaultModel = 'gpt-4o-mini';
    let provider = 'abacusai';
    
    if (apiKey) {
      provider = apiKey.provider;
      defaultModel = apiKey.defaultModel || 
        (apiKey.provider === 'openai' ? 'gpt-4o-mini' : 
         apiKey.provider === 'anthropic' ? 'claude-3-5-sonnet-20241022' : 
         apiKey.provider === 'google' ? 'gemini-flash-latest' :
         'gpt-4o-mini');
    }

    // Log the enhancement request
    await logger.info(
      'resume_enhancement',
      `Starting ${enhancementType} enhancement for resume ${resume.id} using ${provider} (${defaultModel})`,
      { resumeId: resume.id, enhancementType, provider, model: defaultModel },
      session.user.id
    );

    // Create enhancement record
    const enhancement = await prisma.resumeEnhancement.create({
      data: {
        resumeId: resume.id,
        enhancementType,
        enhancedContent: "", // Will be updated when complete
        llmProvider: provider,
        status: "processing",
      },
    });

    // Prepare messages for LLM
    const prompt = ENHANCEMENT_PROMPTS[enhancementType as keyof typeof ENHANCEMENT_PROMPTS];
    
    // Truncate resume content if it's too long
    // Rough estimate: 1 token ≈ 4 characters
    // Leave room for prompt (about 500 tokens) and response (4096 tokens)
    const maxContentChars = (128000 - 4096 - 500) * 4; // ~493,600 characters
    let resumeContent = resume.originalContent || '';
    
    if (resumeContent.length > maxContentChars) {
      // Truncate but try to keep complete sentences
      const truncated = resumeContent.substring(0, maxContentChars);
      const lastPeriod = truncated.lastIndexOf('.');
      const lastNewline = truncated.lastIndexOf('\n');
      const cutoff = Math.max(lastPeriod, lastNewline);
      
      resumeContent = cutoff > 0 ? truncated.substring(0, cutoff + 1) : truncated;
      
      await logger.info(
        'resume_enhancement',
        `Truncated resume content from ${resume.originalContent.length} to ${resumeContent.length} characters`,
        { resumeId: resume.id, originalLength: resume.originalContent.length, truncatedLength: resumeContent.length },
        session.user.id
      );
    }
    
    // For all file types, we now have text content
    const messages: any[] = [{
      role: "user",
      content: `Here is the resume content to enhance:

${resumeContent}

${prompt}`
    }];

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        let useFallback = provider === 'abacusai';
        
        function getApiConfig() {
          // Call LLM API with appropriate endpoint and key
          let apiUrl = '';
          let headers: Record<string, string> = {};
          let currentProvider = useFallback ? 'abacusai' : provider;
          let currentModel = useFallback ? 'gpt-4o-mini' : defaultModel;

          if (currentProvider === 'openai' && !useFallback && decryptedKey) {
            apiUrl = 'https://api.openai.com/v1/chat/completions';
            headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${decryptedKey}`
            };
          } else if (currentProvider === 'anthropic' && !useFallback && decryptedKey) {
            apiUrl = 'https://api.anthropic.com/v1/messages';
            headers = {
              'Content-Type': 'application/json',
              'x-api-key': decryptedKey,
              'anthropic-version': '2023-06-01'
            };
          } else if (currentProvider === 'google' && !useFallback && decryptedKey) {
            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:streamGenerateContent?key=${decryptedKey}`;
            headers = {
              'Content-Type': 'application/json',
            };
          } else {
            // Use Abacus AI API as fallback
            apiUrl = 'https://apps.abacus.ai/v1/chat/completions';
            headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
            };
            currentModel = 'gpt-4o-mini';
            currentProvider = 'abacusai';
          }
          
          return { apiUrl, headers, currentProvider, currentModel };
        }
        
        try {
          let { apiUrl, headers, currentProvider, currentModel } = getApiConfig();

          // Prepare the request body based on provider
          let requestBody: any;
          
          if (currentProvider === 'anthropic') {
            // Anthropic uses a different format
            requestBody = {
              model: currentModel,
              messages: messages.map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
              })),
              max_tokens: 4096,
              stream: true,
            };
          } else if (currentProvider === 'google') {
            // Google Gemini uses a different format
            requestBody = {
              contents: messages.map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{
                  text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
                }]
              })),
            };
          } else {
            // OpenAI and fallback format
            requestBody = {
              model: currentModel,
              messages: messages,
              stream: true,
              max_tokens: 4096,
            };
          }

          let response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });

          // If user's API key fails (401) and we haven't tried fallback yet, retry with Abacus AI
          if (!response.ok && response.status === 401 && !useFallback && provider !== 'abacusai') {
            await logger.info(
              'resume_enhancement',
              `User API key failed (401), retrying with Abacus AI fallback for resume ${resume.id}`,
              { resumeId: resume.id, enhancementType, failedProvider: currentProvider },
              session.user.id
            );
            
            // Switch to fallback
            useFallback = true;
            const fallbackConfig = getApiConfig();
            apiUrl = fallbackConfig.apiUrl;
            headers = fallbackConfig.headers;
            currentProvider = fallbackConfig.currentProvider;
            currentModel = fallbackConfig.currentModel;
            
            // Prepare request body for fallback (OpenAI format)
            requestBody = {
              model: currentModel,
              messages: messages,
              stream: true,
              max_tokens: 4096,
            };
            
            // Retry with fallback
            response = await fetch(apiUrl, {
              method: 'POST',
              headers,
              body: JSON.stringify(requestBody),
            });
          }

          if (!response.ok) {
            const errorBody = await response.text();
            const errorMessage = `LLM API request failed: ${response.status} ${response.statusText}. Response: ${errorBody}`;
            
            await logger.error(
              'resume_enhancement',
              errorMessage,
              { resumeId: resume.id, enhancementType, provider: currentProvider, model: currentModel, status: response.status },
              session.user.id
            );
            
            throw new Error(errorMessage);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body');
          }

          const decoder = new TextDecoder();
          let buffer = '';
          let partialRead = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              // If we reach the end and have content, save it
              if (buffer.trim()) {
                await prisma.resumeEnhancement.update({
                  where: { id: enhancement.id },
                  data: {
                    enhancedContent: buffer,
                    status: 'completed',
                  },
                });

                await logger.info(
                  'resume_enhancement',
                  `Successfully completed ${enhancementType} enhancement for resume ${resume.id}`,
                  { resumeId: resume.id, enhancementType, enhancementId: enhancement.id },
                  session.user.id
                );

                const finalData = JSON.stringify({
                  status: 'completed',
                  result: buffer
                });
                controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }
              break;
            }

            partialRead += decoder.decode(value, { stream: true });
            let lines = partialRead.split('\n');
            partialRead = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') {
                  // Save the final result
                  await prisma.resumeEnhancement.update({
                    where: { id: enhancement.id },
                    data: {
                      enhancedContent: buffer,
                      status: 'completed',
                    },
                  });

                  const finalData = JSON.stringify({
                    status: 'completed',
                    result: buffer
                  });
                  controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }

                if (!data) continue;

                try {
                  const parsed = JSON.parse(data);
                  
                  // Handle different provider response formats
                  let content = '';
                  
                  if (currentProvider === 'anthropic') {
                    // Anthropic format
                    if (parsed.type === 'content_block_delta') {
                      content = parsed.delta?.text || '';
                    }
                  } else if (currentProvider === 'google') {
                    // Google Gemini format
                    content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  } else {
                    // OpenAI and fallback format
                    content = parsed.choices?.[0]?.delta?.content || '';
                  }
                  
                  if (content) {
                    buffer += content;
                    
                    const progressData = JSON.stringify({
                      status: 'processing',
                      message: 'Enhancing resume...'
                    });
                    controller.enqueue(encoder.encode(`data: ${progressData}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                  console.error('Failed to parse streaming data:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Enhancement error:', error);
          
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          // Update enhancement status to error
          await prisma.resumeEnhancement.update({
            where: { id: enhancement.id },
            data: {
              status: 'error',
              enhancementNotes: errorMessage,
            },
          });

          await logger.error(
            'resume_enhancement',
            `Enhancement failed for resume ${resume.id}: ${errorMessage}`,
            { resumeId: resume.id, enhancementType, error: errorMessage },
            session.user.id
          );

          const errorData = JSON.stringify({
            status: 'error',
            message: 'Enhancement failed. Please try again.'
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Enhancement error:", error);
    return NextResponse.json(
      { message: "Enhancement failed" },
      { status: 500 }
    );
  }
}
