#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <emscripten/emscripten.h>

#ifdef __cplusplus
extern "C"
{
#endif

    EMSCRIPTEN_KEEPALIVE
    int validateFlag(char a[])
    {
        int finalResult = EM_ASM_INT({
            let numericalString = UTF8ToString($0);
            let binaryString = "";
            for (let i = 0; i < numericalString.length; i++)
            {
                let digit = parseInt(numericalString.charAt(i));
                binaryString += digit.toString(2).padStart(4, "0"); // Pad each digit with zeros to make it 4 bits long
            }

            // Encode the binary string using a DNA encoding scheme
            let encodedSequence = "";
            for (let i = 0; i < binaryString.length; i += 2)
            {
                let bits = binaryString.substr(i, 2);
                switch (bits)
                {
                case "00":
                    encodedSequence += "A";
                    break;
                case "01":
                    encodedSequence += "C";
                    break;
                case "10":
                    encodedSequence += "G";
                    break;
                case "11":
                    encodedSequence += "T";
                    break;
                default:
                    encodedSequence += "N"; // Use N for unknown bits
                    break;
                }
            }
            console.log(encodedSequence);
            if(encodedSequence==="AGCTAAAGAGAAAGAG"){
                eval(atob('YWxlcnQoJ0NvbmdyYXRzLiBIZXJlIGlzIHlvdXIgZmxhZzogcF9jdGZ7YzBtYkluNHRpMG5fMGZfRDRBX20wcnMzYzBkM18xc19mdTR9Jyk7'));
                return 1;
            }
            return 0;
        },a);
        return finalResult;
    }

#ifdef __cplusplus
}
#endif