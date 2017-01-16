---
layout: slide
title: EBSD data analytics for quantification of UFG microstructures
description: Slides presented at EMI-2016 conference (Metz, France), October 2016.
theme: mywhite
transition: none
modified: 2016-06-28
tags: slides
category: slides
---

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide1.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide2.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide3.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide4.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide5.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide6.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide7.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide8.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide9.PNG" data-background-size="contain">

<div>
<img class="plain" src="{{ site.url }}/images/2016-11-14-emi-presentation/img/chords.gif" weight="250" alt="chords animated"/>

<img class="plain" src="{{ site.url }}/images/2016-11-14-emi-presentation/img/hist.gif" weight="250" alt="histogram animated"/>

</div>

</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide10.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide11.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide12.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide13.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide14.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide15.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide16.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide17.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide18.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide19.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide20.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide21.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide22.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide23.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide24.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide25.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide26.PNG" data-background-size="contain">

<h5> </h5>


<style>
.axis path,
.axis line {
fill: none;
stroke: black;
shape-rendering: crispEdges;
}
.axis text {
font-family: sans-serif;
font-size: 11px;
}

</style>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="{{ site.url }}/images/2016-07-01-presentation/scripts.js" type="text/javascript"></script>
<div class="column" style="float:left; width: 50%" id="left"></div>
<div class="column" style="float:right; width: 50%" id="right"></div>
<div id="author"></div>
<div id="link"></div>

<script>

d3.json('{{ site.url }}/images/2016-07-01-presentation/data/ldr.json',function(error, json) {
  if (error) return console.warn(error);
  data = json
  plotLDR(data);
})
</script>

</section>


<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide27.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide28.PNG" data-background-size="contain">
</section>

<section data-background="{{ site.url }}/images/2016-11-14-emi-presentation/slides/Slide29.PNG" data-background-size="contain">
</section>

<section>
<h2>References and links</h2>

<ol>
  <li><b>Materials Informatics in general</b>:<br>
  <a href="https://dx.doi.org/10.1016/B978-0-12-410394-8.00009-6">S.R. Kalidindi, Hierarchical Materials Informatics: Novel Analytics for Materials Data, 2015</a> (book)
  </li>

  <li><b>Chord-length distribution</b>:<br>
  <a href="https://dx.doi.org/10.1088/0965-0393/24/7/075002">Turner, Niezgoda, and Kalidindi, <i>MSMSE</i> 24 (2016)</a>
  </li>

  <li><b>Structure-property linkage</b>:<br>
  <a href="https://dx.doi.org/10.1016/j.actamat.2015.02.045">Gupta et al., <i>Acta Mater.</i> 91 (2015) 239-254</a>
  </li>

  <li><b>Group website</b>:<br>
  <a href="http://mined.gatech.edu">mined.gatech.edu</a>
  </li>
</ol>

Go back to <a href="http://latmarat.net/blog">blog home</a>

</section>
