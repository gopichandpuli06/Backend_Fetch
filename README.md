"# Backend_Fetch" 

__Backend_Fetch Application Setup__

To run the application Please follow the below steps.
I developed using Windows machine, I recommand to test it on windows.

__Prerequisites__
Ensure that Docker is installed and running on your Windows machine. If not, you can download and install Docker from here. https://www.docker.com/products/docker-desktop

__Application Setup__
1. Once Docker is running on your local machine, clone this repository to your local machine.
2. Navigate to the repository directory in your local machine.
3. Build a Docker image for the application using the following command.
  __Command__: docker build -t node-backend-fetch .
4. Once the Docker image is built, create a Docker container by running the following.
__Command__: docker run -it -p 9001:4500 node-backend-fetch

__Testing the Application__
To test the application, you can use either Postman or cURL.

Using Postman
1. Install Postman if you haven't already.
2. Open Postman and create a new request.
3. Set the request method to POST.
4. Set the URL to: http://localhost:9001/receipts/process
5. In the request body, select "raw" and set the data format to JSON. Add the JSON data as required.

Below image is an example using postman
![Alt text](image.png)

6. Send the request, and it will generate an ID.
__Example:__ 
{
    "id": "c8255b16-f386-467d-8687-4980c26c8dfd"
}
7. Copy the generated ID.
8. Open Google Chrome and visit the following URL, replacing {id} with the copied ID:
Example:
http://localhost:9001/receipts/c8255b16-f386-467d-8687-4980c26c8dfd/points
9. You will receive a response with points.
Sample result example screenshot:
![Alt text](image-1.png)

OR

Using cURL
To use cURL, follow these commands:
Path: /receipts/process
1. Send a POST request to generate an ID:
__Command:__ curl -X POST -H "Content-Type: application/json" -d @data.json http://localhost:9001/receipts/process
2. Copy the generated ID.
3. Send a GET request to fetch points, replacing {id} with the copied ID:
Path: /receipts/{id}/points
__Command:__ curl http://localhost:9001/receipts/b15cf3fa-33a0-4d5d-bfa6-0eec96928612/points
4. These are steps to set up and test the Backend_Fetch application.
