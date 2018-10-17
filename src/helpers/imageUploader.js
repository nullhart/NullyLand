const firebase = require("firebase/app")
var uniqid = require('uniqid');

export default async function imageUploader(base64String, folder, filename) {
    //wait for upload
    var storage = await firebase.storage().ref().child(`${folder}/${uniqid(filename)}`).putString(base64String, 'data_url');
    //return Download URL

    var link = await storage.ref.getDownloadURL()
    var imageId = storage.metadata.name
    var imageInfo = {
        downloadUrl: link,
        id: imageId,
        base64String: base64String

    }
    return imageInfo

}