export default class Console {

     static localResponse(responseJson) {

          console.log('_____________________________________Local Response_____________________________________________')
          console.log(responseJson)
        //  console.log(responseJson.data)
        //  console.log(responseJson.data)
     }

     static apiResponse(responseJson) {

          console.log('_____________________________________Response_____________________________________________')
          console.log(responseJson)
        //  console.log(responseJson.data)
        //  console.log(responseJson.data)
     }

     static apiStatus(status) {

          console.log('_____________________________________Status_____________________________________________')
          console.log(status)
        //  console.log(responseJson.data)
        //  console.log(responseJson.data)
     }

     static apiRequest(requestHeader) {

          console.log('_____________________________________Request____________________________________________')
          console.log(requestHeader)
        
     }
     static apiUrl(url) {
          console.log('_____________________________________URL____________________________________________')
          console.log(url)
        
     }
     static apiParams(params) {
          console.log('_____________________________________Params___________________________________________')
          for(let item in params) {
               console.log(item)
               console.log('\n')
          }
          console.log(params)
     }
     static apiError(error) {
          console.log('_____________________________________Params___________________________________________')
          console.log(error)
          // console.error(error);
     }

     static log(error) {
          // console.log('_____________________________________Params___________________________________________')
          console.log(error)
     }
}
