// Wrapping the whole extension in a JS function 
// (ensures all global variables set in this extension cannot be referenced outside its scope)
(async function(codioIDE, window) {
    
    // initialize coachBot client so it's easier to use
    const coachAPI = codioIDE.coachBot

    // register(id: unique button id, name: name of button visible in Coach, function: function to call when button is clicked) 
    coachAPI.register("qaAssisstantMenuButton", "QA Assisstant Menu", onButtonPress)

    // function called when I have a question button is pressed
    async function onButtonPress() {
        
        const context = await coachAPI.getContext()

        // Open files data (filepath and content)
        let openFiles = context.files
        let openFilesData = ""
        if (openFiles.length > 0) {
           openFiles.map(obj => `
           Filepath: ${obj.path}
           File content: ${obj.content}

           --------------------------------
           `).join('\n')
        }

        coachAPI.showButton("Checker 1: Headers and Typos", onChecker1ButtonPress)
        coachAPI.showButton("Checker 2: Content Sanity Checks", onChecker2ButtonPress)

    }

    async function onChecker1ButtonPress() {
        
        // initialize datetime object for logs
        const dateStringForLogs = `${new Date(Date.now())}`
        
        // lets go over all the possible context here
        const context = await coachAPI.getContext()
        console.log(`context -> `, context)

        // Open Guide Page Data (page name and content)
        var openGuidePageName = context.guidesPage.name
        var openGuidePageContent = context.guidesPage.content

        // check if there's no open guide page
        if (openGuidePageName === "" && openGuidePageContent === "\n") {
            openGuidePageName = ""
            openGuidePageContent = "No Guide Page Open"
        }

        const updatedHeadersTyposUserPrompt = headersTyposUserPrompt.replace('{{CONTENT}}', `Page name: ${openGuidePageName}
        Page content: ${openGuidePageContent}`)
        
        // Send the API request to the LLM and stream response
        const checker1Result = await codioIDE.coachBot.ask({
            systemPrompt: headersTyposSystemPrompt,
            userPrompt: updatedHeadersTyposUserPrompt
        }, {preventMenu: true})

        // save result to a txt file
        const filepath = `.guides/secure/logs/${dateStringForLogs}/checker-1-results.txt`
        try {
            const res = await window.codioIDE.files.add(filepath, checker1Result.result)
            console.log('add file result', res) 
        } catch (e) {
            console.error(e)
        }

        coachAPI.showMenu()
    }

    async function onChecker2ButtonPress() {
        coachAPI.write("Checker 2 pressed")
        coachAPI.showMenu()
    }

    // checker 1 system prompt
    const headersTyposSystemPrompt = `You are a professional content editor with expertise in proofreading and content structure analysis. When reviewing content:

Read thoroughly and systematically, checking every sentence for errors
Pay special attention to header-content alignment and logical organization
Identify all typos, grammatical errors, and awkward phrasing
Provide specific locations and clear corrections for each issue found
Be comprehensive but concise in your feedback
Focus on accuracy and clarity in your assessments`

    // checker 1 user prompt template
    var headersTyposUserPrompt = `First, review the following content:

<content>
{{CONTENT}}
</content>

Now, perform the following checks:

1. Headers and page name:
   - Verify that all headers (including the page name) accurately reflect the content they introduce.
   - Check if the headers are logically organized and follow a coherent structure.

2. Typos and grammatical errors:
   - Carefully proofread the entire content for any spelling mistakes or typos.
   - Check for grammatical errors, including issues with sentence structure, punctuation, and word usage.

After completing your review, provide your findings in the following format:

1. Headers and Page Name Review:
   - List any mismatches between headers/page name and their content
   - Comment on the overall organization of headers

2. Typos and Grammatical Errors:
   - List any typos found, including the incorrect word and its context
   - List any grammatical errors found, including the problematic phrase and a suggested correction

Remember to present your findings in a clear, easy-to-read format. 
Do not use any XML tags in your final output, as it will be streamed directly to the person in chat.

Begin your review now.`

// calling the function immediately by passing the required variables
}

/// kevin codioI

// checker 1 system prompt
    const headersTyposSystemPrompt = `You are an expert in {course name}

Read thoroughly and systematically, checking every sentence for errors
Pay special attention to header-content alignment and logical organization
Identify all typos, grammatical errors, and awkward phrasing
Provide specific locations and clear corrections for each issue found
Be comprehensive but concise in your feedback
Focus on accuracy and clarity in your assessments`

    // checker 1 user prompt template
    var headersTyposUserPrompt = `First, review the following content:

<content>
{{CONTENT}}
</content>

Now, perform the following checks:

1. Headers and page name:
   - Verify that all headers (including the page name) accurately reflect the content they introduce.
   - Check if the headers are logically organized and follow a coherent structure.

2. Typos and grammatical errors:
   - Carefully proofread the entire content for any spelling mistakes or typos.
   - Check for grammatical errors, including issues with sentence structure, punctuation, and word usage.

After completing your review, provide your findings in the following format:

1. Headers and Page Name Review:
   - List any mismatches between headers/page name and their content
   - Comment on the overall organization of headers

2. Typos and Grammatical Errors:
   - List any typos found, including the incorrect word and its context
   - List any grammatical errors found, including the problematic phrase and a suggested correction

Remember to present your findings in a clear, easy-to-read format. 
Do not use any XML tags in your final output, as it will be streamed directly to the person in chat.

Begin your review now.`

// calling the function immediately by passing the required variables
}






)(window.codioIDE, window)

 

  
  
