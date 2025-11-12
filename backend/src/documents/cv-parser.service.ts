import { Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { z } from 'zod';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-parse');

@Injectable()
export class CvParserService {
    private readonly logger = new Logger(CvParserService.name);
    private model: ChatGoogleGenerativeAI;

    constructor() {
        this.model = new ChatGoogleGenerativeAI({
            model: 'gemini-3-flash-preview', // User requested specific model ID
            maxOutputTokens: 8192,
            apiKey: process.env.GEMINI_API_KEY,
        });
    }

    // Define the Strict Output Schema
    private extractSchema = z.object({
        contact: z.object({
            email: z.string().email().optional().describe('Email address found in CV'),
            phone: z.string().optional().describe('Phone number found in CV'),
            linkedin: z.string().optional().describe('LinkedIn profile URL'),
            portfolio: z.string().optional().describe('Portfolio or Personal Website URL'),
            location: z.string().optional().describe('Candidate city/country'),
        }),
        summary: z.string().optional().describe('Professional summary or objective statement'),
        skills: z.array(z.string()).describe('List of technical and soft skills extracted from the CV'),
        experience: z.array(
            z.object({
                title: z.string().describe('Job title'),
                company: z.string().describe('Company name'),
                startDate: z.string().optional().describe('Start date (e.g., "Jan 2020")'),
                endDate: z.string().optional().describe('End date (e.g., "Present", "Dec 2022")'),
                description: z.string().optional().describe('Short description of responsibilities'),
            })
        ).describe('Professional work experience history'),
        education: z.array(
            z.object({
                degree: z.string().describe('Degree or Certificate name'),
                institution: z.string().describe('University or School name'),
                year: z.string().optional().describe('Year of graduation'),
            })
        ).describe('Educational background'),
        languages: z.array(z.string()).optional().describe('Languages spoken'),
    });

    async parse(fileBuffer: Buffer): Promise<any> {
        try {
            this.logger.log('Starting AI CV Parsing...');

            // 1. Fast Path: Extract Text from PDF
            // Fix for "pdf is not a function": Handle CommonJS/ESM interop
            const parseFunc = typeof pdf === 'function' ? pdf : pdf.default;
            const pdfData = await parseFunc(fileBuffer);
            const rawText = pdfData.text;

            if (!rawText || rawText.length < 50) {
                this.logger.warn('PDF text extraction failed or insufficient text. This might be a scanned image.');
                // Fallback or Error (For now, we just return empty/warning as per "Digital PDF First" plan)
                return { error: 'Scanned PDF detected. OCR fallback not active.' };
            }

            this.logger.log(`PDF Text Extracted (${rawText.length} chars). Sending to Gemini...`);

            // 2. Structured Extraction via LangChain
            // 2. Parser with Auto-Fix (Retry on malformed JSON)
            const jsonParser = new JsonOutputParser();
            const formatInstructions = jsonParser.getFormatInstructions();

            const promptTemplate = PromptTemplate.fromTemplate(
                "You are a CV parser. Extract the following information from the text.\n\nSTRICTLY RETURN ONLY VALID JSON. NO MARKDOWN. NO PREAMBLE.\n\n{format_instructions}\n\nResume Text:\n{text}"
            );

            const formattedPrompt = await promptTemplate.format({
                format_instructions: formatInstructions,
                text: rawText,
            });

            this.logger.log('PDF Text Extracted. Sending to Gemini...');

            // Debug methods
            console.log('DEBUG MODEL METHODS:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.model)));

            const messages = [new HumanMessage(formattedPrompt)];
            // @ts-ignore
            const modelResponse = await this.model.invoke(messages);

            let responseContent = typeof modelResponse.content === 'string'
                ? modelResponse.content
                : JSON.stringify(modelResponse.content);

            this.logger.log('Gemini Response Received. Parsing JSON...');

            // Cleanup: Extract JSON if chatty (find first { and last })
            const jsonStart = responseContent.indexOf('{');
            const jsonEnd = responseContent.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                responseContent = responseContent.substring(jsonStart, jsonEnd + 1);
            }

            // Parse Output
            const parsedResponse = await jsonParser.parse(responseContent);

            // Validation (Zod)
            const validatedData = this.extractSchema.parse(parsedResponse);
            return validatedData;

        } catch (error) {
            this.logger.error('Error in CV Parsing', error);
            throw new Error(`CV Parser Error: ${error}`);
        }
    }
}
