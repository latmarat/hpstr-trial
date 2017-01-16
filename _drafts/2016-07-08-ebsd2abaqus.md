---
layout: post
title: "ABAQUS mesh from EBSD using MTEX"
description: "The post describes a framework for generation of ABAQUS finite element mesh from experimental EBSD maps using MTEX toolbox in MATLAB."
modified: 2016-06-24
tags: [mtex, abaqus, matlab, ebsd, microstructures]
mathjax: true
long: true
share: false
---

This article describes a procedure for generating ABAQUS finite element mesh from experimental EBSD maps using MTEX toolbox in MATLAB.

## TODO

- Add image of the final mesh
- Mention that ebsd2abaqus will do fill if there are non-indexed pixels
- finalize model tree

# Introduction

It is often desired to perform micromechanical finite element (FE) analysis of deformation of microstructures based on experimentally measured EBSD maps. The present post describes MATLAB scripts developed for automatic generation of FE mesh for a given EBSD map. The script is easy to use and requires minimal knowledge of coding in MATLAB.

To use the framework described here, you will need

- MATLAB
- MTEX toolbox
- ebsd2abaqus script (available on GitHub [here](https://github.com/latmarat/ebsd2abaqus/blob/master/ebsd2abaqus.m))

# Mesh generation

If you know how to use MTEX for EBSD analysis and have an EBSD map loaded into MATLAB that satisfies the following requirements:

- square grid
- no missing pixels

then [download](https://github.com/latmarat/ebsd2abaqus/archive/master.zip) `ebsd2abaqus` script and generate the FE mesh with a single MATLAB command

{% highlight MATLAB %}
ebsd2abaqus(ebsd,angle)
{% endhighlight %}

where `ebsd` is a MATLAB variable containing the 2D EBSD data of interest and `angle` is the disorientation angle for grain segmentation.

The script takes EBSD pixels to form hexahedral elements of type C3D8 and writes the node coordinates to `inp` file. Grains are passed to ABAQUS as Element Sets and phases are passed as Sections, which makes it easy to assign different properties to grains or phases. Nodes on each face of the mesh are also saved as Node Sets that can be used to prescribe boundary conditions. The script generates pseudo-2D mesh: the mesh will have only 1 element in thickness (along $$z$$ axis).

As a result of running the script, the mesh is written to `ebsd.inp` file. To work with the model, open `ebsd.inp` in ABAQUS/CAE by going File-Import-Model (or modify the input file directly in your favorite text editor). Define  ABAQUS materials for each phase and finalize the finite element model (Step, BCs, etc.) to run the simulations.

If you are new to MTEX and unsure how to process the EBSD data, read on the following sections, which will guide you through the steps necessary to prepare the data for correct mesh generation, such as

- EBSD data import
- conversion from hexagonal to square grid
- clean-up of inaccurate pixels
- filling missing pixels

# EBSD data import

The current framework utilizes MTEX functions so that MTEX must be properly installed in MATLAB. MTEX is a free and open-source MATLAB toolbox for texture and EBSD analysis (available at  [http://mtex-toolbox.github.io/](http://mtex-toolbox.github.io/).

Once MTEX is installed, you need to import the EBSD data into MATLAB. If you have never used MTEX, the simplest way to import the data is through MTEX Import Wizard. Import Wizard can be started by typing ```import_wizard``` in MATLAB command window, which results in a window shown in the figure below.

<figure>
	<a href="https://farm8.staticflickr.com/7293/27900130560_bc7f3a4321_z_d.jpg"><img src="https://farm8.staticflickr.com/7293/27900130560_bc7f3a4321_z_d.jpg" alt="Screen-shots of MTEX Import Wizard"></a>
	<figcaption>Screen-shots of MTEX Import Wizard.</figcaption>
</figure>

Go to `EBSD` tab and click `+`. Browse to your EBSD file and open it. Accept the default settings in several windows, choose *workspace variable* as the import method in Import Data window and push `Finish`. Now EBSD data is stored in a variable `ebsd`. Further data processing will be carried out on this variable.  

# Pre-processing

## Grid conversion

The present framework of building a FE model approximates microstructures by hexahedral mesh, i.e. mesh consisting of cuboidal elements. The use of hexahedral mesh inevitably leads to ladder-like grain/phase boundaries, however, this is assumed to be a sufficiently good approximation for most cases, especially when the EBSD map has a relatively high resolution.

Building a hexahedral mesh is *much* easier if the EBSD data is on a square grid. Since experimental EBSD maps are frequently recorded on hexagonal grids, it is necessary to convert these maps to square grids. In MTEX conversion can be done by using `fill` function:

{% highlight MATLAB %}
ebsd = fill(ebsd)
{% endhighlight %}

**Pro-tip**: If you are unsatisfied with the results of `fill` function of MTEX, you can also convert grids in Dream.3D software (free and open-source, available at  [http://dream3d.bluequartz.net/](http://dream3d.bluequartz.net/)). Have a look at *Convert Hexagonal Grid Data to Square Grid Data*, which also allows for batch conversion of many files as well as grid coarsening (i.e. you can define new spacings of pixels along $$x$$ and $$y$$)
{: .notice}

## Clean-up

Experimental EBSD maps often contain inaccurate pixels which are undesirable in the FE model to be generated. The following pixels can be considered as "undesirable":

- non-indexed pixels
- pixels with low confidence index (CI)
- pixels that belong to unreasonably tiny "grains" (which result in the presence of numerous  grains that consist of only one or two pixels)

Non-indexed and low-quality pixels can be removed with the following lines:

{% highlight MATLAB %}
ebsd('nonIndexed') = []
ebsd(ebsd.ci < minCI) = []
{% endhighlight %}

where `minCI` is the threshold CI such as $$0.1$$.

Getting rid of pixels that belong to unreasonably tiny "grains" require prior grain segmentation:

{% highlight MATLAB %}
[grains,ebsd.grainId,ebsd.mis2mean] = calcGrains(ebsd,'angle',angle*degree);
{% endhighlight %}

with `angle` being the disorientation angle for thresholding grains (e.g. 15).

After grain segmentation, such "bad" pixels can be removed as follows

{% highlight MATLAB %}
indSmallSize = grains.grainSize < minSize;
ebsd(grains(indSmallSize)) = [];
{% endhighlight %}

### Automating the clean-up

Since we are likely to do some clean-up routine over and over again, it is a good idea to put such routine to a separate function.

As an example, I put my cleaning routine into a function called `clean4fem` (available on GitHub [here](https://github.com/latmarat/ebsd2abaqus/blob/master/clean4fem.m)). This function cleans the "bad" pixels mentioned above -- non-indexed, with low CI, and of tiny grains. In addition the script fills the removed pixels with phase ID, grain ID, and orientations equal to that of the grains surrounding these removed pixels.

Finally, for control purposes, the script plots three maps: raw EBSD data, data with inaccurate pixels removed, and finally the cleaned map with filled pixels (see **Example** section).

Typical use of this function will be as follows:

{% highlight MATLAB %}
ebsd = clean4fem(ebsd,minSize,minCI,angle);
{% endhighlight %}

where `minSize` -- is the size of the grain in pixels below which grains are considered unreasonable, `minCI` -- min confidence index to keep, `angle` -- disorientation angle for grain segmentation.

## Crop

Sometimes only a certain region of EBSD map is of interest for FE analysis. In such cases, EBSD maps can be cropped by logical indexing based on coordinates.

For example, if the EBSD map is 30 $$\mu m$$ along $$x$$ (horizontal axis) and 15 $$\mu m$$ along $$y$$ and suppose only one half (along $$x$$) of the map is of interest. Then, the map can be cropped by the following commands:

{% highlight MATLAB %}
ebsd = ebsd(ebsd.x >= 15);
{% endhighlight %}

A more arbitrary region can be also cropped.

{% highlight MATLAB %}
region = [x0 y0 dx dy];
condition = inpolygon(ebsd,region);
ebsd = ebsd(condition);
{% endhighlight %}

**Pro-tip**: it is a good idea to do cropping first because it will save a lot of computational cost: any processing is much faster on a smaller map!
{: .notice}

# Example

Let's try the workflow described above on a realistic EBSD data, for example, on **Forsterite** dataset pre-packaged with all recent MTEX distributions.

### Loading the data

To load the **Forsterite** dataset, simply run the following in MATLAB command line

{% highlight MATLAB %}
mtexdata forsterite
{% endhighlight %}

As a result of this command, the raw EBSD data is loaded into variable `ebsd`, whose visualization using

{% highlight MATLAB %}
plot(ebsd)
{% endhighlight %}

will look as shown below.

<figure>
	<a href="https://farm8.staticflickr.com/7666/28178489705_262f82b54b_z_d.jpg"><img src="https://farm8.staticflickr.com/7666/28178489705_262f82b54b_z_d.jpg" alt="Raw EBSD map"></a>
	<figcaption>Raw Forsterite EBSD map.</figcaption>
</figure>

Here we can see a high-resolution map with several phases and many non-indexed pixels. A perfect dataset to test our framework!

### Cropping the map

The loaded EBSD map has *245,952* pixels, which is a bit overwhelming for a FE analysis so let's crop the EBSD map, say, to a half of the original map along $$x$$ axis:

{% highlight MATLAB %}
ebsd = ebsd(ebsd.x >= max(ebsd.x)/2);
{% endhighlight %}

### Cleaning-up

Now let's clean our map using the helper function `clean4fem`, with the following settings:

- minimum allowed quality: `mad = 0.1`;
- minimum allowed grain size: `5 px`;
- disorientation angle for grain segmentation: 15 degrees.

This can be accomplished with the following command (provided `clean4fem` is placed into MATLAB path)

{% highlight MATLAB %}
ebsd = clean4fem(ebsd,5,0.1,15.0)
{% endhighlight %}

The changes that the EBSD map undergoes are shown in the figure below.

<figure class="third">
	<a href="https://farm8.staticflickr.com/7468/28178492235_b1fe2131d2_z_d.jpg"><img src="https://farm8.staticflickr.com/7468/28178492235_b1fe2131d2_z_d.jpg" alt=""></a>
	<a href="https://farm8.staticflickr.com/7451/28178490905_e191414095_z_d.jpg"><img src="https://farm8.staticflickr.com/7451/28178490905_e191414095_z_d.jpg" alt=""></a>
	<a href="https://farm8.staticflickr.com/7595/28178492625_4b9bb30b59_z_d.jpg"><img src="https://farm8.staticflickr.com/7595/28178492625_4b9bb30b59_z_d.jpg" alt=""></a>
	<figcaption>Changes of the EBSD map that takes place in clean4fem: on the left - raw cropped data, in the middle - "bad" pixels removed, on the right - filled missing and removed pixels.</figcaption>
</figure>

### Mesh generation

Now our EBSD data is ready for mesh generation, which, after downloading `ebsd2abaqus` script, is as simple as

{% highlight MATLAB %}
ebsd2abaqus(ebsd,angle)
{% endhighlight %}

where, again, `angle` is the disorientation angle in degrees for grain segmentation, e.g. 15.

_**Caveat 1**_: pass the segmentation angle without `degree` variable, i.e. for angle of 15 the function call is `ebsd2abaqus(ebsd,15.0)`, just like in the case of `clean4fem` function.
{: .notice}

_**Caveat 2**_: the **forsterite** data is on square grid as required by the `ebsd2abaqus` script. If you feed an EBSD data measured on hexagonal grid, the script will automatically convert it to square grid using `fill` function with a corresponding warning shown in MATLAB command window.
{: .notice}

### The mesh in ABAQUS/CAE

The generated `ebsd.inp` contains the following

- Mesh
- Element Sets for grains and phases
- Sections for phases

so that the model tree in ABAQUS/CAE will have something like this:

{% highlight bash %}
ebsd
├── SAMPLE	# part
|    ├── Sets
|    	├── ALLELEMENTS           # Element set containing all the elements
|    	├── ALLNODES              # Node set containing all the nodes
|    	├── GRAIN-1               # Element set constituting GRAIN-1
|    	├── GRAIN-2               # Element set constituting GRAIN-2
|    	├── ...                   # etc.
|    	├── NODES+1               # Node set containing nodes on the face of +X
|    	├── NODES+2               # Node set containing nodes on the face of +Y
|    	├── NODES+3               # Node set containing nodes on the face of +Z
|    	├── ...                   # etc.
|    	├── PHASE-DIOPSIDE        # Element set constituting phase diopside
|    	├── PHASE-ENSTATITE       # Element set constituting phase enstatite
|    	├── PHASE-FORSTERITE      # Element set constituting phase forsterite
|    	└── PHASE-SILICON         # Element set constituting phase silicon
├── Materials                   # Create materials for all phases!
├── Sections                    # Sections for phases
  	├── Section-1-PHASE-FORSTERITE
  	├── Section-2-PHASE-ENSTATITE
  	├── Section-3-PHASE-DIOPSIDE
   	└── Section-4-PHASE-SILICON
├── Step

└── PHASE-SILICON

{% endhighlight %}

The sections for phases are created assuming that there will be a material for each phase so that for this model we need to create four materials: *Forsterite*, *Enstatite*, *Diopside*, and *Silicon* with the desired properties. Finally once we define all the other ingredients - step, boundary conditions, output, we are ready to run the microstructure-based simulations!
