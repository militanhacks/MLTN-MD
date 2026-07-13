module.exports = async (context) => {
  const { client, m, text } = context;

  try {
    if (!text) {
      return m.reply(
        "🔮 *[SYSTEM NOTICE]*\n\nPlease provide a mathematical expression to calculate.\n\n" +
        "✨ *Example:* `.calc 5 + 3 * 2`\n" +
        "✨ *Complex:* `.calc (12 - 4) / 2.5`"
      );
    }

    // Clean space tokens from the expression
    const cleanExpr = text.replace(/\s+/g, '');

    // Critical Patch: Comprehensive whitelist syntax validation filter
    if (!/^[0-9+\-*/().]+$/.test(cleanExpr)) {
      return m.reply("❌ *[CALCULATION REJECTION]*\n\nUnauthorized characters detected. Only numbers, decimal points, and basic operators `( ) + - * /` are permitted.");
    }

    // SAFE CALCULATION ALTERNATIVE: Tokenized basic math math stack engine
    // Completely bypasses dangerous eval() function calls to shield the hosting server from RCE exploits
    const computeSecurely = (fnString) => {
      try {
        // Tokenize numbers vs operators safely
        const tokens = fnString.match(/\d+\.?\d*|[\+\-\*\/\(\)]/g);
        if (!tokens) return null;

        const values = [];
        const ops = [];

        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

        const applyOp = () => {
          const val2 = values.pop();
          const val1 = values.pop();
          const op = ops.pop();
          if (val1 === undefined || val2 === undefined) throw new Error();
          
          switch (op) {
            case '+': values.push(val1 + val2); break;
            case '-': values.push(val1 - val2); break;
            case '*': values.push(val1 * val2); break;
            case '/': 
              if (val2 === 0) throw new Error("DIV_ZERO");
              values.push(val1 / val2); 
              break;
          }
        };

        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          if (!isNaN(token)) {
            values.push(parseFloat(token));
          } else if (token === '(') {
            ops.push(token);
          } else if (token === ')') {
            while (ops.length && ops[ops.length - 1] !== '(') {
              applyOp();
            }
            ops.pop(); // Remove '('
          } else if (['+', '-', '*', '/'].includes(token)) {
            while (ops.length && precedence[ops[ops.length - 1]] >= precedence[token]) {
              applyOp();
            }
            ops.push(token);
          }
        }

        while (ops.length) {
          applyOp();
        }

        return values.length === 1 ? values[0] : null;
      } catch (err) {
        if (err.message === "DIV_ZERO") return "DIV_ZERO";
        return null;
      }
    };

    const finalResult = computeSecurely(cleanExpr);

    if (finalResult === "DIV_ZERO") {
      return m.reply("❌ *[MATH ERROR]*\n\nDivision by zero is undefined in basic arithmetic constraints.");
    }

    if (finalResult === null || isNaN(finalResult)) {
      return m.reply("❌ *[MALFORMED EXPRESSION]*\n\nFailed to calculate formula. Please verify bracket balance and operators alignment.");
    }

    // Build premium UI calculation readout display layout
    const calcManifest = `🧮 *[𝗠𝗜𝗟𝗜𝗧𝗔𝗡  𝗠𝗔𝗧𝗛  𝗠𝗔𝗧𝗥𝗜𝗫]* 🧮\n\n` +
                          `📝 *Input formula:* \`${text.trim()}\`\n` +
                          `🎯 *Calculated Result:* *${Number(finalResult.toFixed(4))}*\n\n` +
                          `👑 *Core Processor:* MILITAN Math Engine`;

    await m.reply(calcManifest.trim());

  } catch (error) {
    console.error("Fatal exception inside Secure Calculator Module:", error);
    await m.reply("💀 *[ALGORITHM ERROR]*\n\nThe mathematical array processing loop collapsed due to an unexpected structural fault.");
  }
};