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

# stage 2

we will be going for pgsql since the notifiactions will always have fixed fields its easier to mantain and query 


#### the table would have these fields :

id (unique string for each msg)

student_id (to know who the message belongs to)

type (can be "Event", "Result" or "Placement")

message (the actual text)

timestamp (when it was created)

is_read (boolean, default is false)


#### stop the db from getting overwhelmmed

basically we will be indexing the notifiactions and stopping the read notifications to be queired or seen untill specifically searched for or are filtered 

to also stop the db costs from growing further we can use a cron job to run a background clean up every month and also take up snapshots of it as a backup


### queries 

sql queries

based on the apis we made in stage 1 here is the sql the server will run behind the scenes

to fetch the notifications (we use limit to not load all of them at once)
SQL

SELECT * FROM notifications WHERE student_id = '1042' ORDER BY timestamp DESC LIMIT 20;


to mark a notification as read
SQL

UPDATE notifications SET is_read = true WHERE id = '1234' AND student_id = '1042';


to delete a notification
SQL

DELETE FROM notifications WHERE id = '1234' AND student_id = '1042';

 # stage 3

    the logic is accurate but is not up to the mark as select * returns all data which is redundant 
    to tackle this problem firstly i would like to use indexing or to be precise composite indexing using the read field and the studentId field 

    indexing all fields is a bad idea since tho it makes reads faster indexing on everyupadte is a time consuming task which isnt really optimal

   and this is the query i would use 

    SELECT DISTINCT studentID 
    FROM notifications 
    WHERE notificationType = 'Placement' 
    AND createdAt >= NOW() - INTERVAL '7 days';

# stage 4

instead of making a request to the server to fetch the notifications of students what we can do instead is use something like a in mem store like redis which can store calls to our db by storing them in the server basically we will keep the most used notifiactions in db and send them off 

the tradeoff of using this is we still might have to make a request to the db once in a while because the data can change between like being read or unread or deleted

# stage 5

this is a very error prone code since its just a for loop doing the tasks one by one and tho the writes to the db can be fast talking with the email servers is a really slow task since i have experienced it before hand while making a mail agent which can lead to them blocking off each other

therefore to redesign this first i would like to add a try block to it so if it fails we can rerun the task instead of silently exiting from it

for the mails i would like to use kafkas asynchronus messaging to handle it 


function notify_all(student_ids, message) {
    bulk_save_to_db(student_ids, message);
    for (student_id in student_ids) {
        push_to_app(student_id, message);
        email_queue.add_job(student_id, message); 
    }
}

function process_email_queue(job) {
    try {
        send_email(job.student_id, job.message);
    } catch (error) {
        job.retry_later(); 
    }
}


# stage 6 

i think i would just maintain a lru cache kind of structure where it will be sorted based on type where i can set the priorites of each of them like placement would be high and then also use the recency with it as well 


# stage 7 

