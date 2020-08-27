" Make shift-insert work
inoremap <silent>  <S-Insert>  <C-R>+

" Disable default tabline
GuiTabline 0

" Disable popup menu (big, shows the detailed docstrings of object methods)
GuiPopupmenu 0

" Start maximized
call GuiWindowMaximized(1)

" Make clipboard work
call GuiClipboard()

" Make mouse work
set mouse=a

" Make right-click menu work
nnoremap <silent><RightMouse> :call GuiShowContextMenu()<CR>
inoremap <silent><RightMouse> <Esc>:call GuiShowContextMenu()<CR>
vnoremap <silent><RightMouse> :call GuiShowContextMenu()<CR>

" Set buffer name as window title
set title
