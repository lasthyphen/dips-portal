"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openIssue = exports.pullRequestsCount = exports.pullRequestsLast = exports.pullRequestsAfter = exports.pullRequests = void 0;
const graphql_request_1 = require("graphql-request");
exports.pullRequests = (0, graphql_request_1.gql) `
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      pullRequests(
        orderBy: { field: CREATED_AT, direction: ASC }
        first: 100
        states: [OPEN, CLOSED, MERGED]
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        nodes {
          author {
            login
          }
          state
          files(first: 100) {
            nodes {
              path
            }
            totalCount
          }
          url
          title
          body
          createdAt
        }
      }
    }
  }
`;
exports.pullRequestsAfter = (0, graphql_request_1.gql) `
  query repository($name: String!, $owner: String!, $after: String!) {
    repository(name: $name, owner: $owner) {
      pullRequests(
        orderBy: { field: CREATED_AT, direction: ASC }
        first: 100
        states: [OPEN, CLOSED, MERGED]
        after: $after
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        nodes {
          author {
            login
          }
          state
          files(first: 100) {
            nodes {
              path
            }
            totalCount
          }
          url
          title
          body
          createdAt
        }
      }
    }
  }
`;
exports.pullRequestsLast = (0, graphql_request_1.gql) `
  query repository($name: String!, $owner: String!, $last: Int) {
    repository(name: $name, owner: $owner) {
      pullRequests(
        orderBy: { field: CREATED_AT, direction: ASC }
        last: $last
        states: [OPEN, CLOSED, MERGED]
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        nodes {
          author {
            login
          }
          state
          files(first: 100) {
            nodes {
              path
            }
            totalCount
          }
          url
          title
          body
          createdAt
        }
      }
    }
  }
`;
exports.pullRequestsCount = (0, graphql_request_1.gql) `
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      pullRequests {
        totalCount
      }
    }
  }
`;
exports.openIssue = (0, graphql_request_1.gql) `
mutation CreateIssue($repositoryId: ID!, $title: String!, $body: String!) {
  createIssue(
    input: {
      repositoryId: $repositoryId, 
      title: $title,
      body: $body
    }
  ) {
    issue {
      url
    }
  }
}
`;
//# sourceMappingURL=definitions.graphql.js.map