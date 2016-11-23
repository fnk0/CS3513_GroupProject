## CS 3513 Group Project

Members:
* Marcus Gabilheri
* Alex Durville
* Wes Letcher

### Description

Extrapolating trends and models is an important aspect of numerical methods. 
Finding accurate models for large ongoing datasets is a constant search. 
Depending on the data, some models are more effective at plotting accurate results than others. In this paper, we use the CO2 dataset from Oak Ridge National Laboratory and compare several different regression models. 
Global emissions of CO2 is a recurring theme in environmental studies. 
With increasing amounts of CO2 emissions each year, being able to correctly predict trends in global emission rates is critical for environmental scientists. 
We have chosen to analyse the differences between linear regression, quadratic regression, and higher order polynomial regression. 
By using this real world dataset we attempt to determine characteristics of these regression models and identify their strengths and weaknesses.
 
![pic](https://github.com/fnk0/CS3513_GroupProject/blob/master/screenshot.png?raw=true)
![pic2](https://github.com/fnk0/CS3513_GroupProject/blob/master/screenshot2.png?raw=true)

### Code explanation:

The code is written in Javascript using NodeJS. To install the dependencies run
the command ``` npm run install```

If you don't have NodeJS and NPM please refer to: https://docs.npmjs.com/getting-started/installing-node

The math part of the code can be found inside the file ```models.js```
The webpage code can be found inside the public folder. It uses nvd3 to plot the graphs and Angular JS for the javascript structure.
The server code is done using express.js and can be found in the file server.js

The test.js is just used to perform some tests and make sure the math was working properly.

After the dependencies have been installed using npm you can run the code by issuing the command: ```node server.js```

This will serve a local webpage on http://localhost:3000

A live version can also be found on: https://cs3513.herokuapp.com/

The interactive website can be used to experiment with different training periods and order polynomials.