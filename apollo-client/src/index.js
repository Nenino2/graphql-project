import {
    ApolloClient,
    gql,
    InMemoryCache,
  } from '@apollo/client/core';


const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache:new InMemoryCache(),

});

const getUsers = gql`
    query {
        users {
            name
        }
    }
`

const getPosts = gql`
    query {
        posts {
            title
            author {
                name
            }
        }
    }
`

client.query({query: getUsers}).then((response) => {
    let html = '';

    response.data.users.forEach((user) => {
        html += `<li>${user.name}</li>`;
    });

    document.getElementById('users').insertAdjacentHTML("beforeend", html);
})

client.query({query: getPosts}).then((response) => {
    let html = '';

    response.data.posts.forEach((post) => {
        html += `<li>${post.title} - ${post.author.name}</li>`;
    });

    document.getElementById('posts').insertAdjacentHTML("beforeend", html);
})