# Candy Digital / Banners - Contest February 2020

![Letter N](https://raw.githubusercontent.com/GuillaumeFerron/candy-contest/master/letter_n.gif)

## Letter
### N

## Prod
[guillaumeferron.github.io](http://guillaumeferron.github.io/candy-contest)

## Explanation
This snippet has been built using the ThreeJS library. It uses the Geometry instance for the shape, and a Shader with uniforms for the texture.\
The first animation is a power-function expansion of the bevel thickness.\
The second animation is a lessened power-function shrinkage of the bevel thickness.\
The third animation is based on the displacement of the uniforms. We create a randomized vector for each uniform coordinates, whose origin is the latter, and directions is randomized. We then expand each uniforms following those vectors.\
The last animation is a reversion of the third animation, by doing the same operation using the opposite vectors.
