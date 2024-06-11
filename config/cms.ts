export const cms = {
    navbar: {
        title: "Family Apps",
        subtitle: "Private applications to be used and shared with my family.",
    },
    home: {
        title: "Family Apps Launcher",
        subtitle: `
            Private applications are built to maintain privacy and security across commonly used applications and software tools. 
            These applications can allow for personalization and customization beyond what is possible in commercial products. 
            Privatizing application usage gives us the ability to own our data and use it for a variety of personal reasons. 
            Beyond that, many applications carry a financial burden. With private apps we can circumvent these costs.
        `,
        launcherText: "Select an app to launch",
        footerText: "© Copyright 2024. All Rights Reserved.",
    },
    blog: {
        title: "Writings & Words",
        subtitle: "Family Apps Blog",
        footerText: "© Copyright 2024. All Rights Reserved.",
    },
    ai_chat: {
        title: "Chat",
        subtitle: "Ask me anything. I'll do my best to answer.",
        available_models: [
            {
                name: 'PrivateGPT',
                value: 'PrivateGPT',
                description: 'Chat with Documents privately and locally. PrivateGPT is a production-ready AI project that allows you to ask questions about your documents using the power of Large Language Models (LLMs), even in scenarios without an Internet connection. 100% private, no data leaves your execution environment at any point. Selecting this model as default model is required when chatting with ingested documents.',
                notes: 'Really good!'
            },
            {
                name: 'Code Llama',
                value: 'codellama:latest',
                description: 'Code Llama is a model for generating and discussing code, built on top of Llama 2. It’s designed to make workflows faster and efficient for developers and make it easier for people to learn how to code. It can generate both code and natural language about code. Code Llama supports many of the most popular programming languages used today, including Python, C++, Java, PHP, Typescript (Javascript), C#, Bash and more.',
                notes: 'BEST for coding.'
            },
            {
                name: 'Code Llama',
                value: 'codellama:7b-instruct',
                description: '*Note* Model will be used for Open Interpreter. Will be integrated later. Code Llama is a model for generating and discussing code, built on top of Llama 2. It’s designed to make workflows faster and efficient for developers and make it easier for people to learn how to code. It can generate both code and natural language about code. Code Llama supports many of the most popular programming languages used today, including Python, C++, Java, PHP, Typescript (Javascript), C#, Bash and more.',
                notes: 'BEST for automated coding.'
            },
            {
                name: 'Dolphin-Mistral',
                value: 'dolphin-mistral:latest',
                description: 'An uncensored, fine-tuned model based on the Mixtral mixture of experts model that excels at coding tasks. Created by Eric Hartford.',
                notes: 'Experimental.'
            },
            {
                name: 'gemma:latest',
                value: 'gemma:latest',
                description: 'Gemma is a family of lightweight, state-of-the-art open models built by Google DeepMind. Updated to version 1.1',
                notes: 'Google'
            },
            {
                name: 'dolphin-mistral:latest',
                value: 'dolphin-mistral:latest',
                description: 'The Dolphin model by Eric Hartford, based on Mistral version 0.2 released in March 2024. This model is uncensored, available for both commercial and non-commercial use, and excels at coding.',
                notes: 'Uncensored'
            },
            {
                name: 'Llama 2',
                value: 'llama2:latest',
                description: 'Llama 2 is released by Meta Platforms, Inc. This model is trained on 2 trillion tokens, and by default supports a context length of 4096. Llama 2 Chat models are fine-tuned on over 1 million human annotations, and are made for chat.',
                notes: 'BEST general purpose chat model.'
            },
            {
                name: 'Llama 2 Online',
                value: 'Llama 2 Online',
                description: 'Modified to use information from the internet. Llama 2 is released by Meta Platforms, Inc. This model is trained on 2 trillion tokens, and by default supports a context length of 4096. Llama 2 Chat models are fine-tuned on over 1 million human annotations, and are made for chat.',
                notes: 'Free but includes monthly requests cap.'
            },
            {
                name: 'Llama 2 Functions',
                value: 'Llama 2 Functions',
                description: '*In Development* Modified to use functions. Whats for lunch today? What are the open gym times today? These are a few examples of what function calling is capable of doing. Llama 2 is released by Meta Platforms, Inc. This model is trained on 2 trillion tokens, and by default supports a context length of 4096. Llama 2 Chat models are fine-tuned on over 1 million human annotations, and are made for chat.',
                notes: 'In development.'
            },
            {
                name: 'LlaVa',
                value: 'llava:latest',
                description: 'LLaVA is a multimodal model that combines a vision encoder and Vicuna for general-purpose visual and language understanding, achieving impressive chat capabilities mimicking spirits of the multimodal GPT-4. Chat will default to this model when sending images in chat.',
                notes: 'May get removed in favor of newer version.'
            },
            {
                name: 'LlaVa',
                value: 'llava:7b-v1.6',
                description: 'Newest version of LLaVA is a multimodal model that combines a vision encoder and Vicuna for general-purpose visual and language understanding, achieving impressive chat capabilities mimicking spirits of the multimodal GPT-4. Chat will default to this model when sending images in chat.',
                notes: 'Defaults to this model for computer vision.'
            },
            {
                name: 'Mistral',
                value: 'mistral:latest',
                description: 'Mistral is a 7.3B parameter model, distributed with the Apache license. It is available in both instruct (instruction following) and text completion.'
            },
            {
                name: 'SQLCoder',
                value: 'sqlcoder:latest',
                description: 'SQLCoder is a 15B parameter model that is fine-tuned on a base StarCoder model. It slightly outperforms gpt-3.5-turbo for natural language to SQL generation tasks on the sql-eval framework, and outperforms popular open-source models. It also significantly outperforms text-davinci-003, a model that’s more than 10 times its size.'
            },
            {
                name: 'Wizard Math',
                value: 'wizard-math:latest',
                description: 'WizardMath was released by WizardLM. It is trained on the GSM8k dataset, and targeted at math questions. It is available in 7B, 13B, and 70B parameter sizes.',
                notes: 'Good for math.'
            },
        ],
    },
    apps: [
        {
            "name": "Fitness",
            "icon": "🏋️‍♀️",
            "link": "/",
            "url": "https://openfitness.netlify.app/",
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "fitness"
            ]
        },
        {
            "name": "AI",
            "icon": "🤖",
            "link": "/",
            "url": "http://localhost:3002",
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "ai"
            ]
        },
        {
            "name": "camera",
            "icon": "😃",
            "link": "/camera",
            "url": "http://localhost:5175",
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "ai"
            ]
        },
        {
            "name": "ChatBones",
            "icon": "💬",
            "link": "/chat-bones",
            "url": null,
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "ai"
            ]
        },
        {
            "name": "eReader",
            "icon": "📚",
            "link": "/eReader",
            "url": null,
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "ai",
                "eReader",
                "books"
            ]
        },
        {
            "name": "Storage",
            "icon": "😎",
            "link": "/storage",
            "url": null,
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "storage"
            ]
        },
        {
            "name": "Admin Dashboard",
            "icon": "😇",
            "link": "/admin",
            "url": null,
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "admin"
            ]
        }
    ]
}