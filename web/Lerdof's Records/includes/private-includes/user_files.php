<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lerdof's Records</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        * {
            padding: 0%;
            margin: 0%;
            box-sizing: border-box;
        }

        body {
            display: flex;
            height: 100vh;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            font-family: "Press Start 2P";
            background-color: rgb(157, 255, 255);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100vw;
            padding: 30px 20px;
            font-size: 32px;
            font-weight: 700;
            background-color: rgb(255, 98, 78);
        }

        h1 {
            border-radius: 15px;
            background-color: rgb(255, 242, 127);
            padding: 20px 40px;
        }
        .right {
            font-size: 22px;
            transition: all 0.5s ease;
            padding: 10px 20px;
        }
        .right a {
            text-decoration: none;
            color: black;
        }
        .right:hover {
            box-shadow: 5px 5px black;
        }
        .file-viewer-box{
            width: 400px;
            display: flex;
            flex-direction: column;
            gap: 30px;
            margin-bottom: 50px;
        }

        .file{
            margin-top: 5px;
            padding: 10px;
            height: 200px;
            overflow-y: auto;
            border: dotted greenyellow 5px;
            border-radius: 15px;
            background-color: white;
            transition: all 0.5s ease;
        }

        .file:hover {
            box-shadow: 8px 10px black;
        }

        .file::-webkit-scrollbar{
            display: none;
        }

        .file-name{
            margin-bottom: 15px;
        }

    </style>
</head>
<body>
    <div class="header">
        <div class="left">
            Lerdof's Records
        </div>
        <di class="right">
            <a href="logout.php">Logout</a>
        </di>
    </div>
    <h1>Here are your files User</h1>
    <div class="file-viewer-box">
        <div class="file">
            <h2 class="file-name">Nutty Butter</h2>
            <p><?php include('files/file1.txt') ?></p>
        </div>
        <div class="file">
            <h2 class="file-name">Sneks</h2>
            <p><?php include('files/file2.txt') ?></p>
        </div>
        <div class="file">
            <h2 class="file-name">Hidden stuff</h2>
            <p><?php include('files/file3.txt') ?></p>
        </div>
    </div>
</body>
</html>