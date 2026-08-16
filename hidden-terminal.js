/**
 * hidden-terminal.js
 * A secret interactive terminal easter egg for the portfolio.
 * Press the backtick (`) key to open.
 */

(function initSecretTerminal() {
  console.log("Secret Terminal initialized. Press ` to open.");

  let terminalActive = false;
  let terminalElement = null;
  let outputElement = null;
  let inputElement = null;

  const commands = {
    help: "Available commands: help, whoami, skills, projects, clear, sudo, exit",
    whoami: "Ibrahim - Aspiring Backend + AI Systems Engineer.\nBuilding unshakeable foundations in Python, Linux, and SQL.",
    skills: "=> Python, FastAPI, Flask\n=> PostgreSQL, SQL\n=> Git, Linux, Bash\n=> Systems Architecture",
    projects: "Fetching projects...\n1. GitHub Auto-Contributor (Active)\n2. Secret AI Terminal (You are using it)\n=> Type 'exit' to return to GUI.",
    sudo: "Nice try. This incident will be reported.",
    clear: () => {
      outputElement.innerHTML = "";
      return "";
    }
  };

  function createTerminal() {
    terminalElement = document.createElement("div");
    terminalElement.id = "secret-terminal";
    terminalElement.style.cssText = \`
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.95); z-index: 100000;
      color: #00FF00; font-family: 'Courier New', Courier, monospace; font-size: 16px;
      padding: 20px; box-sizing: border-box; overflow-y: auto; display: none;
      backdrop-filter: blur(5px);
    \`;

    terminalElement.innerHTML = \`
      <div>[SYSTEM BOOT] Welcome to Ibrahim's internal server...</div>
      <div>Type 'help' for a list of commands.</div>
      <br/>
      <div id="term-output"></div>
      <div style="display: flex;">
        <span style="margin-right: 8px;">ibrahim@server:~$</span>
        <input type="text" id="term-input" autocomplete="off" spellcheck="false" autofocus
          style="background: transparent; border: none; color: #00FF00; font-family: inherit; font-size: inherit; outline: none; flex-grow: 1; width: 100%;" />
      </div>
    \`;

    document.body.appendChild(terminalElement);
    outputElement = document.getElementById("term-output");
    inputElement = document.getElementById("term-input");

    inputElement.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        const cmd = inputElement.value.trim().toLowerCase();
        inputElement.value = "";
        
        if (cmd === "") return;
        
        printOutput("ibrahim@server:~$ " + cmd);

        if (cmd === "exit") {
          toggleTerminal();
          return;
        }

        if (commands[cmd] !== undefined) {
          if (typeof commands[cmd] === "function") {
            const res = commands[cmd]();
            if (res) printOutput(res);
          } else {
            printOutput(commands[cmd]);
          }
        } else {
          printOutput("bash: " + cmd + ": command not found");
        }
        
        // Scroll to bottom
        terminalElement.scrollTop = terminalElement.scrollHeight;
      }
    });
  }

  function printOutput(text) {
    const div = document.createElement("div");
    div.style.whiteSpace = "pre-wrap";
    div.innerText = text;
    div.style.marginBottom = "5px";
    outputElement.appendChild(div);
  }

  function toggleTerminal() {
    if (!terminalElement) createTerminal();
    
    terminalActive = !terminalActive;
    if (terminalActive) {
      terminalElement.style.display = "block";
      setTimeout(() => inputElement.focus(), 10);
    } else {
      terminalElement.style.display = "none";
      inputElement.blur();
    }
  }

  document.addEventListener("keydown", function(e) {
    if (e.key === "\`" || e.key === "Backquote") {
      e.preventDefault();
      toggleTerminal();
    }
  });

  // Triple Click Secret Trigger (For Mobile / Non-US Keyboards)
  let clickCount = 0;
  let clickTimer = null;
  document.addEventListener("click", function(e) {
    // Ignore clicks inside the terminal itself
    if (terminalElement && terminalElement.contains(e.target)) return;
    
    clickCount++;
    if (clickCount === 3) {
      toggleTerminal();
      clickCount = 0;
    }
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 600);
  });

})();
