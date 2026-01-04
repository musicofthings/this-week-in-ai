import { GoogleGenAI, Type } from "@google/genai";
import { NewsContent, NewsArticle, GroundingSource } from "../types";

export const HISTORICAL_REPORTS: NewsArticle[] = [
  {
    title: "DeepSeek-V3 Open Source Release Disrupts AI Landscape",
    excerpt: "DeepSeek-V3 offers GPT-4o level performance at a fraction of the cost.",
    content: "DeepSeek-V3 represents a paradigm shift in efficient training. Utilizing a Multi-head Latent Attention (MLA) architecture and a massive Mixture-of-Experts (MoE) configuration, it achieves state-of-the-art performance while costing significantly less than its Western counterparts. The release has sparked renewed debate about open-source vs closed-source dominance in the high-end reasoning space, specifically in its handling of coding and mathematical logic which rivals GPT-4o. This model is currently the most popular choice for researchers looking for high-performance open weights and low-latency inference. Furthermore, its training efficiency suggests that the compute moat may be narrowing faster than previously anticipated.",
    category: "MODELS",
    sourceUrl: "https://github.com/deepseek-ai/DeepSeek-V3",
    date: "January 15, 2025",
    tags: ["OpenSource", "DeepSeek", "MoE"]
  },
  {
    title: "Llama 3.1 405B: The First Frontier-Level Open Model",
    excerpt: "Meta releases the world's largest open-weights model to challenge GPT-4.",
    content: "Meta's Llama 3.1 405B marks the first time an open-source model has truly competed at the frontier level. Trained on over 15 trillion tokens, the model provides a foundation for synthetic data generation and distillation, allowing smaller models to benefit from its vast knowledge. The release includes updated safety guardrails and a new license that allows for much broader commercial use than previous versions, effectively decentralizing high-end AI capabilities across the globe and forcing proprietary labs to increase their transparency. This strategic move by Meta positions the company as the primary infrastructure provider for the next generation of AI startups.",
    category: "MODELS",
    sourceUrl: "https://ai.meta.com/blog/meta-llama-3-1/",
    date: "July 23, 2024",
    tags: ["Meta", "Llama", "Frontier"]
  },
  {
    title: "OpenAI Announces o1-series with Reasoning Capabilities",
    excerpt: "OpenAI's o1 model introduces 'Chain of Thought' reasoning for complex tasks.",
    content: "The o1-preview model uses reinforcement learning to think before it speaks, excelling at math and science coding challenges. Unlike previous iterations that predict the next token with probabilistic heuristics, o1 simulates a chain of thought that allows it to catch its own errors and refine its logic during inference. This breakthrough is seen as a major step toward AGI, enabling LLMs to act more like software engineers and scientific researchers than simple chatbots, effectively scaling compute at inference time to solve multi-step problems that were previously thought impossible for LLMs.",
    category: "RESEARCH",
    sourceUrl: "https://openai.com/o1",
    date: "December 12, 2024",
    tags: ["Reasoning", "OpenAI", "STEM"]
  },
  {
    title: "The Emergence of 'Small Language Models' in Edge Computing",
    excerpt: "New research shows SLMs are becoming viable alternatives for on-device tasks.",
    content: "Researchers have demonstrated that models under 3B parameters can now outperform previous 7B and 13B models through superior data curation. This trend toward 'Small Language Models' (SLMs) is critical for privacy-first applications where data cannot leave the user's device. Companies like Apple and Microsoft are increasingly leaning into these compact architectures for mobile assistants and real-time processing, proving that efficiency is the new frontier of AI scaling. This allows for complex AI features to run locally on standard hardware without internet dependencies, protecting sensitive user data while reducing server-side compute costs.",
    category: "RESEARCH",
    sourceUrl: "https://arxiv.org",
    date: "January 12, 2025",
    tags: ["SLM", "EdgeAI", "Efficiency"]
  },
  {
    title: "Cursor and the Rise of AI-First IDEs",
    excerpt: "The coding environment landscape shifts as AI becomes the core, not a plugin.",
    content: "Cursor has redefined the integrated development environment by building AI into the very core of the text editor. By utilizing proprietary context-gathering algorithms, the tool can predict multi-file changes with high accuracy. This 'AI-native' approach is rapidly displacing traditional IDE plugins, as developers find that having an assistant that understands the entire codebase in real-time dramatically reduces 'time-to-first-commit' for complex features and architectural refactoring. It has set a new standard for how developers interact with their source code, effectively turning the editor into a co-author rather than a passive tool.",
    category: "TOOLS",
    sourceUrl: "https://cursor.com",
    date: "January 18, 2025",
    tags: ["Coding", "DX", "Automation"]
  },
  {
    title: "vLLM Library Optimizes LLM Serving at Scale",
    excerpt: "New PagedAttention mechanism enables 24x higher throughput for LLM serving.",
    content: "vLLM has become the industry standard for serving large language models by introducing PagedAttention. This technique manages memory similar to virtual memory in operating systems, preventing fragmentation and allowing for massive batching. For enterprise users, this means a significant reduction in GPU costs and latency, making real-time AI applications economically viable. The project's open-source nature has led to rapid adoption across almost all major AI infrastructure providers, including AWS and Google Cloud, proving that software optimization is as important as hardware scaling.",
    category: "TOOLS",
    sourceUrl: "https://vllm.ai",
    date: "October 10, 2024",
    tags: ["Infrastructure", "Optimization", "GPU"]
  },
  {
    title: "Perplexity AI Raises $500M at $9B Valuation",
    excerpt: "The AI-powered search engine continues its aggressive growth in the consumer space.",
    content: "Perplexity's latest funding round underscores investor confidence in AI as a direct challenger to traditional search advertising. By providing direct answers instead of a list of blue links, Perplexity is forcing giants like Google to rethink their core business model. The startup plans to use the capital to expand its international presence and improve its 'Pro' features, which allow users to choose between various LLMs for different search tasks, effectively becoming a routing layer for web intelligence and real-time knowledge retrieval. This valuation reflects the massive shift in how people expect to interact with the web's knowledge.",
    category: "STARTUPS",
    sourceUrl: "https://perplexity.ai",
    date: "January 08, 2025",
    tags: ["Perplexity", "Search", "Venture"]
  },
  {
    title: "Mistral AI Expands with New Multi-Modal Models",
    excerpt: "The European AI leader releases a new frontier model for visual understanding.",
    content: "Mistral AI continues to push the boundaries of European technology with the release of Pi-Xi, a multimodal model capable of processing high-resolution imagery and complex documents. Unlike previous iterations that predict the next token with probabilistic heuristics, Pi-Xi focuses on high-density data extraction from charts and diagrams, making it a powerful tool for financial and scientific analysis. This move positions Mistral as a direct competitor to Google and OpenAI in the enterprise vision space, while maintaining its commitment to high-efficiency architecture and European data sovereignty. Their rapid iteration cycles have made them a favorite among developers looking for localized AI power.",
    category: "STARTUPS",
    sourceUrl: "https://mistral.ai",
    date: "December 05, 2024",
    tags: ["Mistral", "Vision", "Multimodal"]
  },
  {
    title: "Microsoft 365 Copilot Expands Enterprise Automation",
    excerpt: "New 'Copilot Agents' allow businesses to build custom autonomous workflows.",
    content: "Microsoft is moving beyond simple chat interfaces with the introduction of autonomous agents in Copilot. These agents can monitor email inboxes, trigger complex supply chain queries, and update CRM records without direct user prompting. By integrating deep into the Microsoft 365 ecosystem, these tools are designed to automate the 'glue work' of modern corporate life, effectively acting as digital employees. This marks the beginning of the 'Agentic Era' where AI moves from simple assistant to autonomous executor for business processes, potentially re-defining white-collar productivity metrics.",
    category: "ENTERPRISE",
    sourceUrl: "https://microsoft.com",
    date: "January 10, 2025",
    tags: ["Microsoft", "Copilot", "Enterprise"]
  },
  {
    title: "Salesforce Agentforce Launches Globally",
    excerpt: "Salesforce shifts focus from humans to autonomous agents for customer service.",
    content: "With the launch of Agentforce, Salesforce is betting that the future of CRM lies in autonomous agents rather than human-operated dashboards. These agents can resolve complex customer queries by accessing live data across the Salesforce platform, performing actions like processing returns or rescheduling appointments. The company claims this will dramatically increase efficiency for global enterprises, allowing human workers to focus on more creative and high-value strategic tasks while AI handles routine operations at massive scale, effectively changing the cost structure of customer relationship management.",
    category: "ENTERPRISE",
    sourceUrl: "https://salesforce.com",
    date: "September 18, 2024",
    tags: ["Salesforce", "Agents", "Enterprise"]
  },
  {
    title: "EU AI Act Implementation Timeline Finalized",
    excerpt: "The world's first comprehensive AI regulation enters its critical enforcement phase.",
    content: "The EU has officially set the clock for the first wave of AI Act prohibitions. Starting in mid-2025, 'unacceptable risk' systems like social scoring will be banned, followed by transparency requirements for generative AI. Companies are now scrambling to establish internal compliance frameworks to avoid the massive fines that the Act threatens. This regulation is expected to have a 'Brussels Effect', influencing how AI is governed globally, similar to GDPR's impact on data privacy over the last decade, establishing a standard for ethical AI deployment.",
    category: "POLICY",
    sourceUrl: "https://digital-strategy.ec.europa.eu",
    date: "December 30, 2024",
    tags: ["EU", "Regulation", "Compliance"]
  },
  {
    title: "White House Executive Order on Safe AI Development",
    excerpt: "US Government establishes new standards for AI safety and security.",
    content: "The Biden-Harris administration's executive order represents one of the most significant steps by the US government to manage the risks of AI. It requires developers of the most powerful AI systems to share their safety test results with the government before release. The order also focuses on protecting workers from AI-related displacement and ensuring that AI is used to improve, rather than harm, civil rights and privacy. This policy marks a shift toward proactive oversight in the rapidly evolving American tech sector, balancing innovation with safety.",
    category: "POLICY",
    sourceUrl: "https://whitehouse.gov",
    date: "October 30, 2023",
    tags: ["US", "Safety", "Governance"]
  },
  {
    title: "NVIDIA Blackwell B200 Chips Hit Volume Production",
    excerpt: "The next generation of AI hardware begins shipping to major cloud providers.",
    content: "Blackwell architecture offers up to 25x less cost and energy consumption than previous generations for massive LLM training workloads. This release is pivotal as the industry begins to face energy constraints in data center expansion. NVIDIA's integration of high-speed NVLink interconnects allows thousands of Blackwell GPUs to act as a single unified system, which is essential for training the next generation of 'frontier' models that require trillions of parameters and months of compute power, solidifying NVIDIA's lead in the AI hardware race.",
    category: "HARDWARE",
    sourceUrl: "https://nvidia.com",
    date: "January 02, 2025",
    tags: ["NVIDIA", "Blackwell", "Chips"]
  },
  {
    title: "Groq LPU Architecture Challenges GPU Dominance in Inference",
    excerpt: "New processing units deliver record-breaking tokens-per-second for LLMs.",
    content: "Groq's Language Processing Unit (LPU) has taken the AI community by storm by delivering real-time inference speeds that GPUs struggle to match. By using a deterministic architecture that avoids the complexity of traditional GPU memory management, Groq can serve models like Llama 3 at hundreds of tokens per second. This breakthrough is enabling a new class of ultra-responsive AI applications, from real-time speech translation to high-speed coding assistants that feel instantaneous to the end user, potentially disrupting the training-heavy GPU market.",
    category: "HARDWARE",
    sourceUrl: "https://groq.com",
    date: "September 15, 2024",
    tags: ["Groq", "LPU", "Inference"]
  },
  {
    title: "Physical Intelligence (π) Foundation Models for Robotics",
    excerpt: "A new startup aims to bring the 'GPT moment' to general-purpose robotics.",
    content: "Founded by alumni from OpenAI and Google, Physical Intelligence is developing 'Pi' (π), a universal model designed to control any robot hardware. Currently, most robots are trained on task-specific data, but Pi aims to provide a general-purpose understanding of the physical world. This could lead to a world where robots learn to fold laundry or assemble hardware through observation and internet-scale data, rather than rigid manual programming, effectively bridging the gap between digital and physical intelligence.",
    category: "ROBOTICS",
    sourceUrl: "https://physicalintelligence.company",
    date: "January 14, 2025",
    tags: ["Robotics", "GeneralIntelligence", "Startups"]
  },
  {
    title: "Waymo's 24/7 Service Scaling Across Major US Cities",
    excerpt: "Fully autonomous ride-hailing is now a reality for thousands of daily users.",
    content: "Waymo has quietly become the leader in autonomous transportation by providing over 100,000 paid rides per week across San Francisco and Los Angeles. Their 6th generation sensor suite allows for better performance in inclement weather, a traditional hurdle for L4 autonomy. As they scale, the focus has shifted from safety trials to operational profitability, with Waymo integrating into Uber's platform to handle surge demand in dense urban areas without human intervention, marking the start of a new era in urban mobility.",
    category: "ROBOTICS",
    sourceUrl: "https://waymo.com",
    date: "January 05, 2025",
    tags: ["Autonomous", "Waymo", "Transportation"]
  }
];

const extractJson = (text: string) => {
  let t = text.trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = t.indexOf('{');
  if (start === -1) throw new Error("JSON start not found.");
  let jsonStr = t.substring(start);

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn("JSON truncation detected, attempting reconstruction...");
    const lastClosingBrace = jsonStr.lastIndexOf('}');
    if (lastClosingBrace === -1) throw new Error("Connection interrupted.");
    let partial = jsonStr.substring(0, lastClosingBrace + 1).trim();
    if (partial.includes('"articles"') && !partial.endsWith(']}')) {
      partial = partial.replace(/,\s*$/, '') + ']}';
    }
    try {
      return JSON.parse(partial);
    } catch (innerE) {
      throw new Error("Unable to reconstruct intelligence feed.");
    }
  }
};

export const fetchLatestAINews = async (): Promise<NewsContent> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY not set in Environment Variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const prompt = `Current Date: ${dateStr}. 
    Goal: Identify 15 significant AI developments from the LAST 30 DAYS to populate our news categories.
    Constraints: 
    - Exactly 15 objects in 'articles'.
    - 'content' MUST be a long analytical paragraph (at least 5-6 sentences, approx 600-800 characters) providing deep technical insight.
    - Diversity: MUST provide at least 2 articles for EACH category: RESEARCH, MODELS, TOOLS, STARTUPS, ENTERPRISE, POLICY, HARDWARE, and ROBOTICS.
    - 'sourceUrl' must be a valid direct URL.`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        maxOutputTokens: 8192, 
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  excerpt: { type: Type.STRING },
                  content: { type: Type.STRING },
                  category: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING },
                  date: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["title", "excerpt", "content", "category", "sourceUrl", "date", "tags"]
              },
            },
          },
          required: ["articles"],
        },
      },
    });

    const rawText = result.text || "";

    const data = extractJson(rawText);
    return {
      articles: Array.isArray(data.articles) ? data.articles : [],
      sources: (result.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title })),
      lastUpdated: dateStr
    };
  } catch (error: any) {
    console.error("News Fetch Error:", error);
    throw new Error(error.message);
  }
};