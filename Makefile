# ----- Directories ------------
TOPDIR          =.
CLOSURE_DIR     =$(TOPDIR)/closure-library
COMPILER_DIR    =$(TOPDIR)/closure-library
JSDIR           =$(TOPDIR)/js
OUTDIR          =$(TOPDIR)/php/js-compiled

# ------ Flags -----------------
NAMESPACE_FLAGS       = --namespace=view.MainViewImpl --namespace=models.Model1 \
  --namespace=view.MainViewImplPart1 --namespace=view.MainViewImplPart2 \
  --namespace=view.MainViewImplPart3
NOCOMPILE_FLAGS       = -o script 
SHOWDEP_FLAGS         = -o list
COMPILE_SIMPLE_FLAGS  = -o compiled \
    --compiler_flags="--compilation_level=SIMPLE_OPTIMIZATIONS"
COMPILE_OPTI_FLAGS    = -o compiled \
    --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS"
# ------ Eng flags -------------

# ---- Variables internal to make file ------
BUILDER_FILE_   = $(CLOSURE_DIR)/closure/bin/build/closurebuilder.py
ROOT_FLAGS_     =--root $(CLOSURE_DIR) --root $(JSDIR)
COMPILER_FLAGS_ =-c $(COMPILER_DIR)/compiler.jar

.EXPORT_ALL_VARIABLES:
all: simpleCompile

# This target build with simple optimizations enabled
simpleCompile:
	$(BUILDER_FILE_) $(ROOT_FLAGS_) $(NAMESPACE_FLAGS) $(COMPILE_SIMPLE_FLAGS) \
      $(COMPILER_FLAGS_) --output_file $(OUTDIR)/all-compiled.js

# This target only combines all js into a single file, closure
# compiler is not used
noCompile:
	$(BUILDER_FILE_) $(ROOT_FLAGS_) $(NAMESPACE_FLAGS) $(NOCOMPILE_FLAGS) \
      $(COMPILER_FLAGS_) --output_file $(OUTDIR)/all.js

# This target only combines all js into a single file, using the most
# aggresive optimization from the closure compiler
optiCompile:
	$(BUILDER_FILE_) $(ROOT_FLAGS_) $(NAMESPACE_FLAGS) $(COMPILE_OPTI_FLAGS) \
      $(COMPILER_FLAGS_) --output_file $(OUTDIR)/all-compiledOpti.js 

# This target only shows the dependency calculation output, to make
# sure all files you expect are being included
showDeps:
	$(BUILDER_FILE_) $(ROOT_FLAGS_) $(NAMESPACE_FLAGS) $(SHOWDEP_FLAGS)

clean:
	-rm  $(OUTDIR)/all.js
	-rm  $(OUTDIR)/all-compiled.js
	-rm  $(OUTDIR)/all-compiledOpti.js
