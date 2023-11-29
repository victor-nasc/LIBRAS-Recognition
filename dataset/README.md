## :floppy_disk: Data collection

To reduce computational costs, we chose to work with tabular data representing the coordinates of the user's hand landmarks.

We captured them using the [CVZone](https://github.com/cvzone/cvzone) Hand Tracking module, normalized them to values between 0 and 1 based on the hand's bounding box, and reshaped them to 1 $\times$ 64.

The data format should be as follows: (N $\times$ 64)

| label |   x0  |   y0   |   z0  | $\dots$ |  x20  |  y20  |  z20  |
|-------|-------|-------|-------|---------|-------|-------|-------|
| char  | float | float | float | $\dots$ | float | float | float |


21 different labels (all static latters in LIBRAS)

| A | B | C | D | E | F | G | I | L | M | N | O | P | Q | R | S | T | U | V | W | Y |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|


## :camera: Usage
```bash

# Run the program
python3 collect_data.py 

#    Arguments: --save=SAVE --size=SIZE
#        --save: save images (default: False)
#        --size: number of images to capture (default: 256)
```
