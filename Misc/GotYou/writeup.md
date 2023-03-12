# Writeup

## Got You

1) Listen to the audio file. There will be a morse code added in between the audio.
2) On decoding it you get a new route which will lead to a padlock page.
3) Examining that site u will get to know that it is a webassembly challenge.
4) Now, having a look at the initial function call from the script tag in html file, you will get to know that validateFlag() is the starting function call, to tha wasm file.
``` js
    function validate() {
      const enteredPin = document.getElementById("pin-input").value;
      const result = Module.ccall(
        "validateFlag",
        "number",
        ["string"],
        [enteredPin]
      );
      console.log(enteredPin);
      if (result == 1) {
        console.log("Success")
      } else {
        alert("Incorrect PIN. Please try again.");
      }
    }
```
5) Looking into that function we can a list of stack variables which is represented by i32.const, we come across few const. In that
```
 i32.const 1024
``` 
represent a variable which is a return value.

``` wasm
(func $validateFlag (;5;) (export "validateFlag") (param $var0 i32) (result i32)
    (local $var1 i32)
    (local $var2 i32)
    (local $var3 i32)
    (local $var4 i32)
    (local $var5 i32)
    (local $var6 i32)
    (local $var7 i32)
    (local $var8 i32)
    (local $var9 i32)
    (local $var10 i32)
    (local $var11 i32)
    (local $var12 i32)
    (local $var13 i32)
    (local $var14 i32)
    (local $var15 i32)
    (local $var16 i32)
    global.get $global0
    local.set $var1
    i32.const 16
    local.set $var2
    local.get $var1
    local.get $var2
    i32.sub
    local.set $var3
    block
      local.get $var3
      local.tee $var15
      global.get $global2
      i32.lt_u
      if
        call $env.__handle_stack_overflow
      end
      local.get $var15
      global.set $global0
    end
    i32.const 6
    local.set $var4
    local.get $var3
    local.get $var4
    i32.add
    local.set $var5
    local.get $var5
    local.set $var6
    i32.const 0
    local.set $var7
    i32.const 105
    local.set $var8
    local.get $var3
    local.get $var0
    i32.store offset=12
    local.get $var3
    local.get $var8
    i32.store8 offset=6
    local.get $var3
    local.get $var7
    i32.store8 offset=7
    local.get $var3
    i32.load offset=12
    local.set $var9
    local.get $var3
    local.get $var9
    i32.store
    i32.const 1024   <----------------------
    local.set $var10
    local.get $var10
    local.get $var6
    local.get $var3
    call $env.emscripten_asm_const_iii
    local.set $var11
    local.get $var3
    local.get $var11
    i32.store offset=8
    local.get $var3
    i32.load offset=8
    local.set $var12
    i32.const 16
    local.set $var13
    local.get $var3
    local.get $var13
    i32.add
    local.set $var14
    block
      local.get $var14
      local.tee $var16
      global.get $global2
      i32.lt_u
      if
        call $env.__handle_stack_overflow
      end
      local.get $var16
      global.set $global0
    end
    local.get $var12
    return
  )
```

6) Now moving on to that, we can see a string which is an javascript code with some HTML encoding in it. On decoding it, we get
``` js
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
```

7) Now we can see that, DnA encoding is been used. No reverse it, we get the correct input string as
```
    27022022
```
by which we get the alert message of the flag

```
p_ctf{c0mbIn4ti0n_0f_D4A_m0rs3c0d3_1s_fu4}
```