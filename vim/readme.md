# Installation and configuration of vim

Back to [main page](../readme.md).

Usually I work with [vim](https://en.wikipedia.org/wiki/Vim_(text_editor)), [neovim-qt](https://github.com/equalsraf/neovim-qt) and [Kate](https://en.wikipedia.org/wiki/Kate_%28text_editor%29). Lightweight.

The information below is for your inspiration. This is how I **install and configure vim** with plugins:

+ [YouCompleteMe](https://awesomeopensource.com/project/ycm-core/YouCompleteMe?categoryPage=3) for [autocompletion](https://en.wikipedia.org/wiki/Autocomplete)
+ [emmet-vim](https://github.com/mattn/emmet-vim/) for Zen coding in HTML and CSS
+ [Gruvbox theme](https://github.com/morhetz/gruvbox) for gentle [eye candy](https://en.wikipedia.org/wiki/Eye_Candy_(Visual_appeal))
+ [yajs.vim](https://github.com/othree/yajs.vim) for syntax highlighting in JavaScript, and to enable code folding
+ [vim-airline](https://github.com/vim-airline/vim-airline) to get a nice status bar and tab line


```
# Installation of vim:
sudo apt-get install vim vim-addon-manager vim-youcompleteme ctags-exuberant

# Install code completion in your home directory
vam install youcompleteme

# Install plugin manager https://github.com/junegunn/vim-plug (activated in .vimrc)
wget https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim -O ~/.vim/autoload/plug.vim

# If you don't have a file ~./.vimrc yet:
cp /etc/vim/vimrc ~/.vimrc

# Add config in this directory to ~./.vimrc
cat ./vimrc >> ~/.vimrc

# Install plugins using vim-plug
vim +PlugInstall +qall

# Settings for ctags-exuberant, more info see [here](../basch-script/tags-file.sh)
cp -af ./ctags.cfg ~/.ctags

```

## Installation and configuration of gvim

```
sudo apt-get install vim-gtk3

# If you don't have a file ~./.gvimrc yet:
cp /etc/vim/gvimrc ~/.gvimrc

# Add config in this directory to ~./.gvimrc
cat ./vimrc >> ~/.gvimrc

```

To start gvim maximized, you could add the following lines to (the bottom of) **~./.gvimrc**:

```
" Start maximized
set lines=999 columns=999

```

## Installation and configuration of Neovim

After installation of vim you could also install Neovim and the GUI-version Neovim-qt:

```
sudo apt-get install neovim neovim-qt

cp -ar ./nvim ~/.config/

```

## Health warnings

Some health warnings that you might not be aware of yet:

+ Often working with a mouse can cause [Repetitive Strain Injury](https://en.wikipedia.org/wiki/Repetitive_strain_injury) (RSI) in your body or mouse. For that reason keyboard shortcuts can be quite handy. So... would you like to use a mouse? Or even a keyboard? During times of intense writing like coding, I wear out a keyboard during a few months. Like keys for a lock which need replacement.
+ According to information from a known [editor war](https://en..wikipedia.org/wiki/Editor_war), using [Emacs](https://en.wikipedia.org/wiki/Emacs) seems to induce a [Carpal Tunnel Symdrome](https://en.wikipedia.org/wiki/Carpal_tunnel_syndrome) (CTS). So... would you like to use Emacs?
+ Vim seems a classic, while in fact promotes [compartmentalization](https://en.wikipedia.org/wiki/Compartmentalization_(psychology)) of thinking - thus causing fierce episodes of [cognitive dissonance](https://en.wikipedia.org/wiki/Cognitive_dissonance) - using various modes of operation. Which is a psychological risk that you need to resist. For example, switching from insert to command mode might raise the impression that you have suddenly changed personality from developer to redactional editor.

  It seems authors and fans of vim assume you are [schizophrenic](https://en.wikipedia.org/wiki/Schizophrenia) (from Greek for "splitting of the mind") and have a [Multiple Personality Syndrome](https://en.wikipedia.org/wiki/Dissociative_identity_disorder) (MPS) nowadays known as Dissociative Identity Disorder (DID). You know, when you DID it. Don't you fall for such thinking, it's a common pitfall! 😀

  If you can resist temptation to become psychologically ill, vim offers a **lightning fast experience** while writing code with as little as possible memory consumption and processor load. Assuming you don't resent learning commands and such.

[comment]: <> (No comments here)
