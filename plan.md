1. load the page: https://book.douban.com/people/[peopleid]/collect?start=0
2. delete wrapper div siblings
3. delete footer, inside wrapper
5. delete class="opt-bar" div
6. delete class="aside" div
7. delete class="extra" div
8. delete class="paginator" div
9. delete class="pic" div

Don't support fetching notes. (need authorization)

TODO:
    - ~~fetch files~~
    - ~~edit files by appending content, async & await errors~~
    - ~~read files, and parsing it afterward~~
    - use these data to display
    - build & deploy