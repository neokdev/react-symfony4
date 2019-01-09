'use strict';

import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../css/main.scss';
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
