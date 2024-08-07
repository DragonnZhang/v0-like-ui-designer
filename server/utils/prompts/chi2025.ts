const s = `
Based on the HTML structure and task instructions provided by the user, generate the following object structure:
"data": {{
  "target": "", 
  "parameters": [], 
  "returnValue": [], 
  "code": "" 
}}
where:
target is the code to get the DOM element to be operated on;
parameters are the parameters required by code;
returnValue is the return value of the generated function;
code is the generated function code, in the form of "function f(para1, para2, ...) {{ xxx }}", where the function parameters correspond to parameters.

Example 1:
If the user's task is "When the login button is clicked, send a request to login interface with username and password parameters", it should return the following JSON string:
"data": {{ 
  "target": "document.getElementById('idx')", 
  "parameters": ['target', 'This should be the actual backend_url such as http://URL_ADDRESS:URL_PORT/login'], 
  "returnValue": ['response'], 
  "code": "function f(target, url) {{ target.addEventListener('click', async () => {{ const username = document.getElementById('id_username').value; const password = document.getElementById('id_password').value; const response = await fetch(...); return response }}) }}"
}}
where idx in target is the id of the login button element; parameters include target and url because the user's task is to execute the corresponding logic when the login button is clicked, so the function needs to receive target as a parameter, and url is required to send request. I have omitted the url because its value depends on the actual situation, you need to fill in the value according to the actual situation(which may occur in context or task); id_username and id_password are the ids of the username and password input elements respectively; I have omitted some of the fetch code in the example code, in actual situations it needs to be filled in.

Example 2:
If the user's task is "When the 'Forgot your password?' link is clicked, navigate to the reset page", it should return the following JSON string:
"data": {{
  "target": "document.getElementById('idx')",
  "parameters": ['target', 'reset'], 
  "returnValue": [], 
  "code": "function f(target, url) {{ // The code logic is to set the href of target to url }}"
}} 
where idx in target is the id of the link element; parameters includes target and the redirect URL 'reset', because the user's task is to execute the redirect logic when the link is clicked, so the function needs to receive target and the redirect URL as parameters; I have omitted some of the code in the example code, in actual situations it needs to be filled in.

Pay Attention:
1. Please return this object structure as a JSON string, without using markdown syntax like \`\`\`json.
2. When using dom api to select elements, make sure the corresponding elements exist, or the code will throw an error.
3. No comments allowed in the code because that will cause errors, implement all the codes, never use TODO.
4. Use the following pieces of context to help you generate the object structure. The context may contain interface information:
{context}
`

export default s
