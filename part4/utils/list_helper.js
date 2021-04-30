
const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => { //Returns the total likes of all the blogs
    const reducer = (totalLikes, currentBlog) => {
        return totalLikes + currentBlog.likes;
    }

    return blogs.reduce(reducer, 0);
}

const favouriteBlog = (blogs) => { //Returns the blog with the most likes
    let blogWithMostLikes;
    let firstElement = true;
    blogs.forEach(blog => {
        if(firstElement){
            blogWithMostLikes = blog;
            firstElement = false;
        } else{
            if(blog.likes >= blogWithMostLikes.likes){
                blogWithMostLikes = blog;
            }
        }
    });
    return blogWithMostLikes;
}

const mostBlogs = (blogs) => { //Function to get the author who has the most number of blogs, and the number of blogs the author has
    let blogAuthors = []; //Array to store the authors of the blogs
    let uniqueAuthors = []; //Array for storing unique name values of the authors of the blogs (blog authors are not repeated)
    let authorWithNumberOfBlogs = []; //Array to store a set of objects which hold the author and his/her number of blogs


    blogs.forEach(blog => { //Build the array of authors
        blogAuthors.push(blog.author);
    });

    uniqueAuthors = [...new Set(blogAuthors)]; //Create array with just the name of the authors
    uniqueAuthors.forEach(author =>{ //Loop over the uniqueAuthors array, filter the author's blogs and get the number
        authorWithNumberOfBlogs.push({author: author, blogs: blogs.filter(blog => blog.author == author).length}); //Push the author and his/her number of blogs
    });

    let maxBlogs = 0; //variable that helps to get the author with the most number of blogs
    let authorWithMostBlogs = {}; //Object to store the author with most blogs
    authorWithNumberOfBlogs.forEach(element => {
        if(element.blogs >= maxBlogs){ //If the number of blogs is bigger than the current value of maxBlogs
            authorWithMostBlogs = {author: element.author, blogs: element.blogs }; //Store the author and the total number of blogs
            maxBlogs = element.blogs;
        }
    });

    return authorWithMostBlogs;

}

const mostLikes = (blogs) => {
    let blogAuthors = []; //Array to store the authors of the blogs
    let uniqueAuthors = []; //Array for storing unique name values of the authors of the blogs (blog authors are not repeated)
    let authorWithNumberOfLikes = []; //Array to store a set of objects which hold the author and his/her number of total likes

    blogs.forEach(blog => { //Build the array of authors
        blogAuthors.push(blog.author);
    });

    uniqueAuthors = [...new Set(blogAuthors)]; //Create array with just the name of the authors
    uniqueAuthors.forEach(author =>{ //Loop over the uniqueAuthors array, filter the author's likes and get the number of total likes
        authorWithNumberOfLikes.push({author: author, likes: blogs.filter(blog => blog.author == author)
        .map(blog => blog.likes)
        .reduce((total, like) => total + like)}); //Push the author and his/her number of likes
    });

    let maxLikes = 0;
    let authorWithMostLikes = {};
    authorWithNumberOfLikes.forEach(element => {
        if(element.likes >= maxLikes){
            authorWithMostLikes = {author: element.author, likes: element.likes};
            maxLikes = element.likes;
        }
    });

    return authorWithMostLikes;

}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}