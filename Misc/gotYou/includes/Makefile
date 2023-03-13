build:
	mkdir ./build
	cp ./src/index.html ./build/ 
	cp -r ./src/public ./build/
	emcc -o ./build/rickroll.html ./src/main.c --shell-file ./src/rickroll.html -s NO_EXIT_RUNTIME=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"
clean:
	rm -rf ./build/