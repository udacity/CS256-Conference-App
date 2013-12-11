/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function InstructionsView() {
        BaseView.call(this);
    }

    // The HomeUIController class extends the BaseUIController class.
    InstructionsView.prototype = Object.create( BaseView.prototype );

    InstructionsView.prototype.getDomElement = function() {
        return this.generateInstructionsPane();
    };

    InstructionsView.prototype.generateToggle = function() {
        var popupIcon = document.createElement('a');
        popupIcon.classList.add('toggle');
        popupIcon.addEventListener('click', function(event) {}, false);

        return popupIcon;
    };

    InstructionsView.prototype.generatePinButton = function() {
        var pinButton = document.createElement('button');
        pinButton.classList.add('pin-button');

        return pinButton;
    };

    InstructionsView.prototype.generatePinButtonSection = function() {
        var pinLeftButton = this.generatePinButton();
        var pinRightButton = this.generatePinButton();
        var pinBottomButton = this.generatePinButton();
        var pinButtonSection = document.createElement('section');

        pinButtonSection.classList.add('pin-button-section');
        pinButtonSection.appendChild(pinLeftButton);
        pinButtonSection.appendChild(pinBottomButton);
        pinButtonSection.appendChild(pinRightButton);

        return pinButtonSection;
    };

    InstructionsView.prototype.generateTaskHeader = function(header) {
        var headerElement = document.createElement('span');
        var textElement = document.createTextNode(header);

        headerElement.classList.add('task-header');
        headerElement.appendChild(textElement);

        return headerElement;
    };

    InstructionsView.prototype.generateTaskInstruction = function(instruction) {
        var instructionElement = document.createElement('div');
        var textElement = document.createTextNode(instruction);

        instructionElement.classList.add('task-instruction');
        instructionElement.appendChild(textElement);

        return instructionElement;
    };

    InstructionsView.prototype.generateTaskSegue = function(segue) {
        var segueElement = document.createElement('div');
        var textElement = document.createTextNode(segue);

        segueElement.classList.add('task-segue');
        segueElement.appendChild(textElement);

        return segueElement;
    };

    InstructionsView.prototype.generateTask = function(task) {
        var taskElement = document.createElement('div');
        var textElement = document.createTextNode(task);
        var tasksSection = document.querySelector('.tasks-section');

        taskElement.classList.add('task-item');
        taskElement.appendChild(textElement);

        tasksSection.innerHTML = '';
        tasksSection.appendChild(taskElement);
    };

    InstructionsView.prototype.generateTasksSection = function() {
        var tasksSection = document.createElement('div');

        tasksSection.classList.add('tasks-section');

        return tasksSection;
    };

    InstructionsView.prototype.generateInstructionsPane = function() {
        //var pinButtonSection = this.generatePinButtonSection();
        var tasksSection = this.generateTasksSection();
        var instructionsContainer = document.createElement('section');

        instructionsContainer.classList.add('instructions-pane');
        instructionsContainer.classList.add('visible');
        instructionsContainer.classList.add('pin-left');

        //instructionsContainer.appendChild(pinButtonSection);
        instructionsContainer.appendChild(tasksSection);

        return instructionsContainer;
    };

    return InstructionsView;
});