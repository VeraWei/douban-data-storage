CATEGROY[0]="book"
CATEGROY[1]="movie"
CATEGROY[2]="music"

SUB_CATEGROY[0]="do"
SUB_CATEGROY[1]="wish"
SUB_CATEGROY[2]="collect"

export PERSONAL_COOKIE='bid=1S50d3rycE8; _cc_id=f983cc0a40f89eb5408dab368a1adb14; ll="108258"; __utmc=81379588; douban-fav-remind=1; ct=y; viewed="2115948"; _vwo_uuid_v2=D7D6904E3DF43CB658D43688637B7B484|f35339063058b791287c28cbe9076776; gr_user_id=e56e683b-4002-4578-a295-5d6fdaec2609; push_doumail_num=0; __utmc=30149280; __utmz=30149280.1640919334.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/people/nothinganymore/; ucf_uid=27435e43-2471-4484-ad99-3fca4c453d77; __utma=30149280.193323090.1640919334.1640919334.1640983119.2; ap_v=0,6.0; push_noty_num=0; dbcl2="252269522:WEXO2OkCnr4"; ck=pM68; __utmt=1; __utmv=30149280.25226; __utmt_douban=1; __utma=81379588.924918561.1639268764.1640983119.1640988171.18; __utmz=81379588.1640988171.18.8.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.3ac3=%5B%22%22%2C%22%22%2C1640988172%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.3ac3=*; gr_session_id_22c937bbd8ebd703f2d8e9445f7dfd03=2dbe3f95-9500-475b-a970-a04018d37868; gr_cs1_2dbe3f95-9500-475b-a970-a04018d37868=user_id%3A1; gr_session_id_22c937bbd8ebd703f2d8e9445f7dfd03_2dbe3f95-9500-475b-a970-a04018d37868=true; __gads=ID=ce554dfac77fa647-22762724eecf0019:T=1635053162:RT=1640988219:S=ALNI_MYkD9o4nMoyT77NxBW3SMCOJBt9NA; __utmb=30149280.41.10.1640983119; __utmb=81379588.6.9.1640988213919; _pk_id.100001.3ac3=adf7b86dbab3cc8b.1639268765.18.1640988226.1640984711.'

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
