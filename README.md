# Practical Accendero - Recipe Web App
A recipe web application to demonstrate technical abilities. This app allows you to create and store recipes.

## Setup
The backend server uses SQLite and DJango-Rest framework written in Python. First ensure python3 is installed, then run:
```
python3 -m pip install git+https://github.com/Robert-N7/PracticalAccendero.git
``` 
To run the server:
```
python3 ./djangoApi/manage.py runserver
```
And then open the following url:
```
localhost:8000/
```

## Building
The front end uses React written in javascript. You may use npm to build and run the app.
```
npm install && npm run debug
```

## Running Tests
Tests on the Python backend can be run with:
```
./djangoApi/manage.py test
```
Tests on the frontend react components were done with jest.
```
npm run-script test
```

## Links to Documentation Used
[Tutorial on ReactJS, DJango](https://www.youtube.com/watch?v=f5ygXQKF6M8)

[Creating foreign key in django models](https://docs.djangoproject.com/en/3.1/topics/db/examples/many_to_one/)

[JWT User Authentication](https://hackernoon.com/110percent-complete-jwt-authentication-with-django-and-react-2020-iejq34ta)

[Testing a DJango Application](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Testing)

[Testing - DJango](https://www.django-rest-framework.org/api-guide/testing/)

[Currently Logged in User](https://stackoverflow.com/questions/1477319/in-django-how-do-i-know-the-currently-logged-in-user)

[Pass URL as Parameter](https://stackoverflow.com/questions/52188784/pass-a-url-as-parameter-in-django-urls)

[Undefined Request Data](https://stackoverflow.com/questions/48189532/get-request-with-axios-returning-undefined)

[Current Url in React](https://surajsharma.net/blog/current-url-in-react)

[DJango Rest with React](https://www.valentinog.com/blog/drf/#django-rest-with-react-the-react-frontend)

[Adding Additional Field to ModelSerializer](https://stackoverflow.com/questions/18396547/django-rest-framework-adding-additional-field-to-modelserializer)

[New line in React String](https://forum.freecodecamp.org/t/newline-in-react-string-solved/68484)

[HTML \<input\> accept Attribute](https://www.w3schools.com/tags/att_input_accept.asp)

[CSS Grid Item](https://www.w3schools.com/css/tryit.asp?filename=trycss_grid_item)

[Managing Files | DJango Documentation](https://docs.djangoproject.com/en/dev/topics/files/)

[Infinite loop in interceptor](https://stackoverflow.com/questions/30607750/infinite-loop-in-interceptor)

[How to add authentication header in apiclient](https://stackoverflow.com/questions/50678609/how-to-add-authentication-token-in-header-of-apiclient-in-django-rest-framewo)

[Uploading images to rest api backend in React JS](https://medium.com/@emeruchecole9/uploading-images-to-rest-api-backend-in-react-js-b931376b5833)

[How to use CSRF token in Django RESTful API](https://stackoverflow.com/questions/50732815/how-to-use-csrf-token-in-django-restful-api-and-react)

[React render new row every 4th column](https://stackoverflow.com/questions/42391499/react-render-new-row-every-4th-column)

[Declarative Routing for React](https://reactrouter.com/web/example/auth-workflow)

[Testing React Apps - Jest](https://jestjs.io/docs/25.x/tutorial-react)

[Asynchronous Jest](https://jestjs.io/docs/asynchronous)