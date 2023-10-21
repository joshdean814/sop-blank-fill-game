// function to retrieve an array of text prompts
export function getTexts()  {
    return [
        {
            // text template with placeholders enclosed in brackets
            text: `[name], a [adjective] [noun], decided to [verb] to [place] in search of a legendary [noun]. Armed with [adjective] [noun]s, they encountered a talking [noun] who offered [verb] and [noun]. After [number] days of [verb]ing, they discovered a [adjective] [noun], the world's most [adjective] [noun], which could [verb] anything! They couldn't resist using it on their [noun], creating a [adjective] [place]. [name]'s [place] turned into a [adjective] wonderland filled with [noun]s [verb]ing and [adjective] [noun] [verb]ing, making it the silliest [place] ever. And so, [name] and their [adjective] [place] lived happily ever after, with [noun]s [verb]ing and [adjective] [noun] [verb]ing all day, making everyone laugh!`,
            enabled: true, // whether this text prompt is initially enabled
            color: [237, 117, 113] // RGB color theme for this text prompt
        }, 
        {
            text: `[name], the [adjective] [noun], embarked on a [adjective] journey to find a legendary [noun]. Along the way, they met a talking [noun] who offered many [plural noun]. With the help of [adjective] [plural noun], they completed three [adjective] tasks: [verb], [verb], and [verb]. Returning to [place], [name] used their newfound [noun] to bring [adjective] joy to the land. And so, [name] became a [adjective] hero, known for [adjective] [noun] and [adjective] [noun].`, 
            enabled: false, 
            color: [71, 196, 213]
        }, 
        {
            text: `[person], a [adjective] [noun], [verb] to the [place] with their friend [same person]. They brought [number] [plural noun] and met [same name] at the [same place]. [same name] had a [adjective] [noun] which [person] found [adjective]. Together, they [verb]ed [number] times, making the [place] the [adjective] [place] ever. [person] found a magical [noun] that could [verb] anything into [adjective] [noun]. They used it on their [noun], creating the most [adjective] [noun] ever! [person] and [same name] turned [same place] into a non-stop [noun] show. They became known for [adjective] pranks and [adjective] jokes. So, [person] and [same name] lived happily ever in [same place], where [same plural noun] [verb]ed and [same adjective] [noun] [verb]ed, making everyone laugh!`, 
            enabled: false, 
            color: [166, 61, 165]
        }, 
        {
            text: `There was a [person] who went to the [place] with his friend, a [name]. When they went to the [place] with her Aunt, Mrs. [name] they were [verb] to discover that she had a massive [noun]. After hearing a blood-curdling [noun], they proceeded to go to the [place]. There was a friend who went to the [place] with his friend, a [adjective]. When they went to the [place] with her Aunt, Mrs. [name] they were [verb] to discover that she had a massive [noun]. After hearing a blood-curdling [noun], they proceeded to go to the [place]. After hearing a blood-curdling [verb], they proceeded to go to the [place]. Aunt, Mrs. [name] they were [adjective] to discover that she had a massive [verb].`, 
            enabled: false, 
            color: [255, 127, 76]
        }, 
        {
            text: `When they went to the [place] with her Aunt, Mrs. [name] they were [verb] to discover that she had a massive [noun]. After hearing a blood-curdling [noun], they proceeded to go to the [place]. After hearing a blood-curdling [verb], they proceeded to go to the [place]. Aunt, Mrs. [name] they were [adjective] to discover that she had a massive [verb]. There was a [person] who went to the [place] with his friend, a [name]. When they went to the [place] with her Aunt, Mrs. [name] they were [verb] to discover that she had a massive [noun]. After hearing a blood-curdling [noun], they proceeded to go to the [place]. There was a friend who went to the [place] with his friend, a [adjective]. `, 
            enabled: false, 
            color: [0, 204, 101]
        }
    ];
}