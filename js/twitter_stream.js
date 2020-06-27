function load_tweets(screen_name, div) 
{
    var tw = new TwitterStream(screen_name, div);
    tw.get_tweets();
}

function TwitterStream(screen_name, div) 
{
    // member variables
    this.screen_name = screen_name;
    this.div = div;
    
    // methods
    this.get_tweets = get_tweets;
    
    function get_tweets () 
    {
        var url = 'http://twitter.com/statuses/user_timeline.json?screen_name=' + this.screen_name;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(event)
        {
            if (xhr.readyState == 4)
            {
                if (xhr.status == 200)
                {
                    // var result = eval(xhr.responseText);
                    console.log(xhr.responseText);
                }
                else 
                {
                    console.log(xhr.status);
                }
            }
        }
        ;
        xhr.open('GET', url);
        xhr.send();
    }
}