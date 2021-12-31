CATEGROY[0]="book"
CATEGROY[1]="movie"
CATEGROY[2]="music"

SUB_CATEGROY[0]="do"
SUB_CATEGROY[1]="wish"
SUB_CATEGROY[2]="collect"

# Inital folder:
rm -rf personal && mkdir -p personal

#Generate Pages:

for categroy in ${CATEGROY[@]}
do
    mkdir -p personal/$categroy
    for sub_categroy in ${SUB_CATEGROY[@]}
    do
        mkdir -p personal/$categroy/$sub_categroy/list
        INFO_URL="https://$categroy.douban.com/people/$PERSONAL_KEY/$sub_categroy"
        curl "https://$categroy.douban.com/people/$PERSONAL_KEY/$sub_categroy" -H 'Referer: https://$categroy.douban.com' -H "Cookie: $PERSONAL_COOKIE" --compressed --output personal/$categroy/$sub_categroy/list/0.html
    done
done

# only for books, annotation
mkdir -p personal/book/annotation/list
curl "https://book.douban.com/people/$PERSONAL_KEY/annotation/" -H 'Referer: https://book.douban.com' -H "Cookie: $PERSONAL_COOKIE" --compressed --output personal/book/annotation/list/0.html

# handle reviews
mkdir -p personal/reviews/list
curl "https://www.douban.com/people/$PERSONAL_KEY/reviews" -H 'Referer: https://book.douban.com' -H "Cookie: $PERSONAL_COOKIE" --compressed --output personal/reviews/list/0.html
npm run data-handler
