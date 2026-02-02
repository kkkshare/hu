
const fs = require('fs');
const path = require('path');

const folderMap = {
    'monster_toon': { path: 'g3_upper/monster_toon/page_', ext: '.jpg', audio: 'monster_toon.mp3' },
    'fox_hen': { path: 'g3_upper/fox_hen/page_', ext: '.jpg', audio: 'fox_hen.mp3' },
    'schoolbag': { path: 'g3_upper/schoolbag/page_', ext: '.jpg', audio: 'schoolbag.mp3' },
    'tiger_coming': { path: 'g3_upper/tiger_coming/page_', ext: '.jpg', audio: 'tiger_coming.mp3' },
    'drawing': { path: 'g3_upper/drawing/page_', ext: '.jpg', audio: 'drawing.mp3' },
    'i_can_see': { path: 'g3_upper/i_can_see/page_', ext: '.jpg', audio: 'i_can_see.mp3' },
    'fish': { path: 'g5_lower/fish/page_', ext: '.jpg', audio: 'fish.mp3' },
    'long_wait': { path: 'g5_lower/long_wait/page_', ext: '.jpg', audio: 'long_wait.mp3' },
    'best_time': { path: 'g5_lower/best_time/page_', ext: '.jpg', audio: 'best_time.mp3' },
    'whose_dog': { path: 'g5_lower/whose_dog/page_', ext: '.jpg', audio: 'whose_dog.mp3' },
    'homework': { path: 'g5_lower/homework/page_', ext: '.jpg', audio: 'homework.mp3' },
    'class_trip': { path: 'g5_lower/class_trip/page_', ext: '.jpg', audio: 'class_trip.mp3' },
    'new_teacher': { path: 'g5_upper/new_teacher/page_', ext: '.jpg', audio: 'new_teacher.mp3' },
    'zob_bored': { path: 'g5_upper/zob_bored/page_', ext: '.jpg', audio: 'zob_bored.mp3' },
    'street_party': { path: 'g5_upper/street_party/page_', ext: '.jpg', audio: 'street_party.mp3' },
    'emma_birthday': { path: 'g5_upper/emma_birthday/page_', ext: '.jpg', audio: 'emma_birthday.mp3' },
    'empty_room': { path: 'g5_upper/empty_room/page_', ext: '.jpg', audio: 'empty_room.mp3' },
    'toby_eagle': { path: 'g5_upper/toby_eagle/page_', ext: '.jpg', audio: 'toby_eagle.mp3' },
    'zob_school': { path: 'g4_upper/zob_school/page_', ext: '.jpg', audio: 'story.mp3' },
    'mimi_superhero': { path: 'g4_upper/mimi_superhero/page_', ext: '.jpg', audio: 'story.mp3' },
    'tortoise_friends': { path: 'g4_upper/tortoise_friends/page_', ext: '.jpg', audio: 'story.mp3' },
    'quiet_house': { path: 'g4_upper/quiet_house/page_', ext: '.jpg', audio: 'story.mp3' },
    'dinner_dragon': { path: 'g4_upper/dinner_dragon/page_', ext: '.jpg', audio: 'story.mp3' },
    'puppy_box': { path: 'g4_upper/puppy_box/page_', ext: '.jpg', audio: 'story.mp3' },
    'lost_zob': { path: 'g4_lower/lost_zob/page_', ext: '.jpg', audio: 'story.mp3' },
    'angry_dragon': { path: 'g4_lower/angry_dragon/page_', ext: '.jpg', audio: 'story.mp3' },
    'eek_spider': { path: 'g4_lower/eek_spider/page_', ext: '.jpg', audio: 'story.mp3' },
    'village_show': { path: 'g4_lower/village_show/page_', ext: '.jpg', audio: 'story.mp3' },
    'world_book_day': { path: 'g4_lower/world_book_day/page_', ext: '.jpg', audio: 'story.mp3' },
    'sara_medicine': { path: 'g4_lower/sara_medicine/page_', ext: '.jpg', audio: 'story.mp3' },
    'play_with_me': { path: 'g3_lower/play_with_me/page_', ext: '.jpg', audio: 'play_with_me.mp3' },
    'caterpillar_home': { path: 'g3_lower/caterpillar_home/page_', ext: '.jpg', audio: 'caterpillar_home.mp3' },
    'prince_seb_pet': { path: 'g3_lower/prince_seb_pet/page_', ext: '.jpg', audio: 'prince_seb_pet.mp3' },
    'snail_adventure': { path: 'g3_lower/snail_adventure/page_', ext: '.jpg', audio: 'snail_adventure.mp3' },
    'king_yu_player': { path: 'g3_lower/king_yu_player/page_', ext: '.jpg', audio: 'king_yu_player.mp3' },
    'what_did_get': { path: 'g3_lower/what_did_get/page_', ext: '.jpg', audio: 'what_did_get.mp3' },
    'box_books': { path: 'g6_upper/box_books/page_', ext: '.jpg', audio: 'story.mp3' },
    'lorna_upset': { path: 'g6_upper/lorna_upset/page_', ext: '.jpg', audio: 'story.mp3' },
    'dont_forget': { path: 'g6_upper/dont_forget/page_', ext: '.jpg', audio: 'story.mp3' },
    'stop_everyone': { path: 'g6_upper/stop_everyone/page_', ext: '.jpg', audio: 'story.mp3' },
    'zob_work': { path: 'g6_upper/zob_work/page_', ext: '.jpg', audio: 'story.mp3' },
    'eliza_jane': { path: 'g6_upper/eliza_jane/page_', ext: '.jpg', audio: 'story.mp3' },
    'new_king': { path: 'g6_lower/new_king/page_', ext: '.jpg', audio: 'story.mp3' },
    'weekend_bear': { path: 'g6_lower/weekend_bear/page_', ext: '.jpg', audio: 'story.mp3' },
    'camping_trip': { path: 'g6_lower/camping_trip/page_', ext: '.jpg', audio: 'story.mp3' },
    'tiny_tv': { path: 'g6_lower/tiny_tv/page_', ext: '.jpg', audio: 'story.mp3' },
    'dining_dragons': { path: 'g6_lower/dining_dragons/page_', ext: '.jpg', audio: 'story.mp3' },
    'bellas_bike': { path: 'g6_lower/bellas_bike/page_', ext: '.jpg', audio: 'story.mp3' }
};

const baseDir = '/Users/hulanfang/长期助理/hu_project';
const imagesDir = path.join(baseDir, 'assets/reading/images');
const audioDir = path.join(baseDir, 'assets/reading/audio');

console.log('--- Resource Check Report ---');

for (const [id, config] of Object.entries(folderMap)) {
    // Check first page image
    const firstPage = path.join(imagesDir, `${config.path}00${config.ext}`);
    if (!fs.existsSync(firstPage)) {
        console.error(`[IMAGE MISSING] ID: ${id}, Path: ${firstPage}`);
    }

    // Check audio
    let audioPath;
    if (config.audio === 'story.mp3') {
        const folderPath = config.path.substring(0, config.path.lastIndexOf('/') + 1);
        audioPath = path.join(imagesDir, folderPath, 'story.mp3');
    } else {
        audioPath = path.join(audioDir, config.audio);
    }

    if (!fs.existsSync(audioPath)) {
        console.error(`[AUDIO MISSING] ID: ${id}, Path: ${audioPath}`);
    }
}

console.log('--- Check Completed ---');
