int r = 13;
int g = 12;
int b = 8;

int x = 1;

void setup() {        
  Serial.println("Arduino is ready!");
  pinMode(r, OUTPUT);
  pinMode(g, OUTPUT);
  pinMode(b, OUTPUT);
  // I'm in listener on 9600 bound
  Serial.begin(9600);  
}

void loop() {
   if (Serial.available() == 3) {
      // Store all input data into an array of int
      long int input[3];
      /*do {
        if (Serial.available()) {
          if (x==1) {*/
           input[0]= Serial.read();
           Serial.print("Red: ");
           Serial.println(input[0]);
           //analogWrite(digitalOutputPinForRedLED, valueOfRed);
         /*}else if (x==2) {*/
           input[1] = Serial.read();
           Serial.print("Green: ");
           Serial.println(input[1]);
           //analogWrite(digitalOutputPinForGreenLED, valueOfGreen);
         /*} else if (x==3) {*/
           input[2] = Serial.read();
           Serial.print("Blue: ");
           Serial.println(input[2]);
           //analogWrite(digitalOutputPinForBlueLED, valueOfBlue);
         /*}
         x++;
        }else{
          x = 1;
        }
      }while(x < Serial.available());*/
      
      // If the first input is 256, I need to make a random color
      if (input[0] == 0 && input[1] == 0 && input[2] == 0) {
         randomColors();
      }else{
         analogWrite(r, input[0]);
         analogWrite(g, input[1]);
         analogWrite(b, input[2]);
         delay(200);
         Serial.println("Acceso");
         x = 1;
      }
      
   } 
} 

long int retrieveInput(){
  long int input[3];
  do {
    if (Serial.available()) {
      if (x==1) {
       input[0]= Serial.read();
       Serial.print("Red: ");
       Serial.println(input[0]);
       //analogWrite(digitalOutputPinForRedLED, valueOfRed);
     }else if (x==2) {
       input[1] = Serial.read();
       Serial.print("Green: ");
       Serial.println(input[1]);
       //analogWrite(digitalOutputPinForGreenLED, valueOfGreen);
     } else if (x==3) {
       input[2] = Serial.read();
       Serial.print("Blue: ");
       Serial.println(input[2]);
       //analogWrite(digitalOutputPinForBlueLED, valueOfBlue);
     }
     x++;
    }else{
      x = 1;
    }
  }while(x < Serial.available());
  return input;
}

void randomColors(){
  int i = 0;
  do{
    setColourRgb(random(0,200), random(0,200), random(0,200));
    delay(150);
    i++;
  }while(i <= 100);  
}

void setColourRgb(unsigned int red, unsigned int green, unsigned int blue) {
  analogWrite(r, red);
  analogWrite(g, green);
  analogWrite(b, blue);
 }
