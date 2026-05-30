<?php
$current_page = $_SERVER['REQUEST_URI'] == '/' ? 'index' : basename($_SERVER['REQUEST_URI']);
?>
<nav class="navbar" id="navbar">
    <a href="/"><div class="logo">INSIGHT <span>Travel</span></div></a>
    <div class="menu-toggle" id="mobile-menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </div>
    <ul class="nav-links">
        <li><a href="/#services">Services</a></li>
        <li><a href="umrah-landing.php">Umrah Packages</a></li>
        <li><a href="world-tour-landing.php">World Tours</a></li>
        <li><a href="subagent_register.php">Partner With Us</a></li>
        <li><a href="/#contact">Contact</a></li>
    </ul>
</nav>
