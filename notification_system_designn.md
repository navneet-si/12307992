# stage 1

designing a notification system for logged in users 
we will be using sockets to implement the functionalitys of the notification

## core functionalites 

user should be able to get realtime notifiaction without having to click a button or refresh any page

user should be able to query the notifications based on what is the type of message

user should be able to mark them as read or delete them 

### route to fetch  a page with all the notifications 

headers{
  "Content-Type": "application/json",
  "x-student-id": "1042" 
}

 /api/notifications
 body {
    id,
    bearer "token",
 }

 optional parameters would include 
    "type" : string  

response would include a array with all the notifications

    {
        "data" :[
    {
      "id": "1234",
      "type": "xyz1",
      "message": "hello",
      "timestamp": ,
      "isRead": false
    },
    {
      "id": "123",
      "type": "xyz" ,
      "message":"hi",
      "timestamp":,
      "isRead": true
    }
  ]
    }



### Mark as Read
PATCH /api/notifications/:id/read

{
  "success": true,
  "message": "Marked as read",
  "updatedId": "b283218f-ea5a-4b7c"
}

### Delete a Notification

{
  "success": true,
  "message": "Notification deleted"
}

