---
layout: post
title: "ABAQUS volumetric mesh from Dream.3D surface mesh"
description: "The post describes a MATLAB script for obtaining ABAQUS tetrahedral volume mesh from surface mesh of grain boundaries generated in Dream.3D."
modified: 2016-01-18
tags: [dream.3d, abaqus, matlab]
mathjax: true
long: true
share: false
---

The post describes a MATLAB script for obtaining ABAQUS tetrahedral volume mesh from surface mesh of grain boundaries generated in Dream.3D.

# Intro

In the [previous post](http://latmarat.net/blog/dream2abahex/), I described a MATLAB script to write hexahedral ABAQUS mesh for a microstructure generated in Dream.3D. Brick elements make for a good mesh quality and thus a decent numerical stability of finite element simulations. At the same time, the use of brick elements inevitably leads to ladder-shaped grain boundaries.

Sometimes, it is desired to include the effect of the intricate curvature of grain boundaries in finite element simulations. For example, with realistic grain boundaries incorporated in the finite element models, it is possible to track the evolution of grain boundary facet normals or even grain boundary character disribution during plastic deformation (see [_Knezevic et al., 2014_](http://dx.doi.org/10.1016/j.cma.2014.05.003)).

Dream.3D currently allows for meshing grain boundaries by triangular elements (see [_Lee et al., 2014_](http://dx.doi.org/10.1088/0965-0393/22/2/025017) for details). It is often a challenge to produce volume mesh from surface mesh of grain boundaries, which may require commercial software.

This post describes an alternative method based on an open-source MATLAB toolbox for grain boundary-conformed mesh generation. The described method requires running a single MATLAB script that writes mesh into a text file that can be readily imported in ABAQUS.

## The script

The MATLAB script presented here does the following:

- Reads nodes, triangles of surface mesh and feature centroids generated in [Dream.3D](http://dream3d.bluequartz.net/) (ver. 4.2.x)
- Generates volume tetrahedral mesh using [iso2mesh](http://iso2mesh.sf.net) toolbox
- Writes the generated mesh into a file in ABAQUS input file format

![Surface to volume](https://farm1.staticflickr.com/678/22464316136_3b726c739e_o_d.png)
![ABAQUS mesh](https://farm6.staticflickr.com/5768/22476919562_704bd12470_o_d.png)

## Usage

To use the script, do the following:

1. Download [iso2mesh](http://iso2mesh.sf.net) toolbox and add it to MATLAB path
2. [Download `dream2abatet.m`](https://github.com/latmarat/dream2abatet/archive/master.zip) script and put it to a MATLAB folder
3. Run Dream.3D pipeline to write nodes, triangles, features files
4. Run `dream2abatet.m` script pointing to the three Dream.3D files

## Example

[My repository](https://github.com/latmarat/dream2abatet) for `dream2abatet` script contains a set of example files for testing and getting familiar with the framework. The files that can be used for a test run of the script are

- ex_nodes.in
- ex_tri.in
- ex_features.in

You can use them to generate your first mesh as follows

1. Download the repo, extract the files to a MATLAB folder.
2. Run

{% highlight MATLAB %}
dream2abatet('ex_nodes.in','ex_tri.in','ex_features.csv',0.75,0.5,true)
{% endhighlight %}

in MATLAB and you should get a file `dream.inp` containing your mesh. Check it in ABAQUS/CAE by setting colors in the Viewer according to Sets. The result should look like the image above.

The repository also contains an example Dream.3D (ver. 4.2.5) pipeline - `ex_pipe.txt`, which writes the `ex_nodes.in`, `ex_tri.in`, `ex_features.csv` files for a 32x32x32 single-phase microstructure grid.

**Tip**: Both Dream.3D and iso2mesh allow for smoothing of the surface mesh. Furthermore, the function of `iso2mesh` toolbox responsible for the mesh generation takes several parameters as input, such as `keepRatio` and `maxVolElement` -- the number of surface elements to be preserved during volume mesh generation and the maximum volume of the tetrahedral element (set as 0.75 and 0.5 in the example above). You can go through the documentation of both software packages to get familiar with the meshing and smoothing parameters as well as to experiment with them until a satisfactory mesh quality is achieved.
{: .notice}

## Known limitations

1. The script requires grain centroids. The only option to export centroids in Dream.3D ver. 4.2.x seems to be Write Goal Attributes in _Pack Primary Phases_ filter. Since the generated microstructure does not necessarily match the goal attributes exactly, some grains may be missing in ABAQUS sets.
2. The workflow does not work well with periodic boundaries set in Dream.3D: either generation of volume mesh will fail or the number of missing grains in ABAQUS sets will increase.
3. Generation of volume mesh may fail for some microstructures (Invalid PLC error). In such cases, rerun Dream.3D pipeline and try again or try different Dream.3D settings.
4. No information on phases will be passed to ABAQUS in the current version of the script.
