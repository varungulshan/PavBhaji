This repository is for Attempt no 1. creating a better photo browsing and
navigation experience.

Instructions for compiling code using closure library:

[1] First step is to combine all the js files into one big js file, where
    the closure builder will take care of the dependencies and layout files
    in the correct order. You can view the computed dependencies using the 
    following command (it will output to stdout):

    ./closure-library/closure/bin/build/closurebuilder.py \
    --root=closure-library/ \
    --root=js/ \
    --namespace=view.MainViewImpl --namespace=models.Model1
    
    The --root flags gives directories containing source code.
    The --namespace gives the packages from which to start computing
    dependencies (i.e initialize the dependency calculation). Its nice to see
    that actually our view and model are so independent that we have
    to initialize dependency calculation for them separately :).

    So check the output of this to see if any files you expect to be included
    are being left out (probably due to incorrect dependency specifications
    in the .js files).

[2] To combine all the output js files into one big file (without compiling it)
    use the following command:

    ./closure-library/closure/bin/build/closurebuilder.py \
    --root=closure-library/ --root=js/ \
    --namespace=view.MainViewImpl --namespace=models.Model1 \
    -o script > ./php/js-compiled/all.js

[3] To combine all the output js files into one big file and also compile it
    use the following command:

    closure-library/closure/bin/build/closurebuilder.py \
    --root=closure-library/ --root=js/ \
    --namespace=view.MainViewImpl --namespace=models.Model1 \
    -o compiled -c closure-library/compiler.jar > \
    ./php/js-compiled/all-compiled.js

    To run this, you need to download the closure compiler from:
    http://closure-compiler.googlecode.com/files/compiler-latest.zip

    The above does not specify the compiler flags. Various compiler options are
    available that might affect the optimization.
