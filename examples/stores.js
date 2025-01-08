let projectStore = (function() {
  let readProjectId = function() {
    return window.localStorage.getItem("projectId");
  }
  let setProjectId = function(projectId) {
    window.localStorage.setItem("projectId", projectId);
  }

  let readProjectKey = function() {
    return window.localStorage.getItem("projectKey");
  }
  let setProjectKey = function(projectId) {
    window.localStorage.setItem("projectKey", projectId);
  }

  return {
    readProjectId,
    setProjectId,
    readProjectKey,
    setProjectKey
  }
})()

let gwConfStore = (function() {
  let readGwConf = function() {
    return window.localStorage.getItem("gwConf");
  }
  let setGwConf = function(gwConf) {
    window.localStorage.setItem("gwConf", gwConf);
  }

  return {
    readGwConf,
    setGwConf
  }
})()

let customerTokenStore = (function(){
  let readCustomerTokenId = function() {
    return window.localStorage.getItem("customerTokenId");
  }
  let setCustomerTokenId = function(customerTokenId) {
    window.localStorage.setItem("customerTokenId", customerTokenId);
  }

  return {
    readCustomerTokenId,
    setCustomerTokenId
  }
})()
