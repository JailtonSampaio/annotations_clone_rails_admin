/*!
 * Bootstrap BoxAutocomplete Selector v0.1.0 (https://github.com/Djagu/bootstrap-boxautocomplete-selector.git)
 *
 * Copyright 2016 bootstrap-boxautocomplete-selector
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */
(function ( $ ) {

    $.fn.boxautocomplete = function( options ) {

        var settings = $.extend({
            data: [],
            dataUrl: false,
            valueFormat: 'text', // text|json
            delemiter: ";",
            hideInput: true,
            search: false,
            searchPlaceholder: "Search for an element...",
            searchButtonText: "Clear",
            searchMin: 1,
            uniqueValue: true,
            getItem: function(dataItem, valueFormat){
                var item = '<li class="list-group-item">\
                <span class="ba-name"></span>\
                <button type="button" class="btn btn-default btn-sm pull-right ba-add"><i class="fa fa-arrow-right"></i></button>\
                <button type="button" class="btn btn-default btn-sm pull-left ba-remove hide"><i class="fa fa-times"></i></button>\
                <div class="clearfix"></div>\
              </li>';
                var jItem = $(item);
                jItem.find('.ba-name').html(dataItem.name);
                if (valueFormat == "json")
                {
                    var dataClone = jQuery.extend(true, {}, dataItem);
                    delete dataClone.baSelected;
                    jItem.attr('data-ba-value', JSON.stringify(dataClone));
                }
                else
                    jItem.attr('data-ba-value', dataItem.value);

                return jItem;
            },
            updateInput: function(jInput, valueFormat){
                if (jInput !== undefined)
                {
                    jInput.val('');
                    jInput.attr('value', '');
                    var items = jInput.closest('.ba-box-autocomplete').find('.ba-selected-items .list-group-item');
                    var itemSelected = [];
                    items.each(function(index){
                        if (valueFormat == "json")
                        {
                            console.log("Pushing = " + $(this).attr('data-ba-value'));
                            itemSelected.push(jQuery.parseJSON($(this).attr('data-ba-value')));
                            // We put it in the val for the last item
                            if (items.length == (index + 1))
                            {
                                console.log("Stringiggg >> " + JSON.stringify(itemSelected));
                                jInput.val(JSON.stringify(itemSelected));
                            }
                        }
                        else
                            jInput.val(jInput.val() + settings.delemiter + $(this).attr('data-ba-value'));
                    });
                    jInput.attr('value', jInput.val());
                }
            },
            updateDataList: function(data){

            },
            searchFilterBy: function(itemsContainer, filter){

                if (itemsContainer !== undefined)
                {
                    console.log("Begin to search...");
                    itemsContainer.find('.list-group-item').each(function(){
                        if($(this).find('.ba-name').eq(0).text().toLowerCase().indexOf(filter.toLowerCase()) != -1)
                        {
                            console.log("Fuond ");
                            $(this).show();
                        }
                        else
                        {
                            $(this).hide();
                        }
                    });
                }
            }
        }, options );


        var ba = this;

        this.isValueInData = function(value)
        {
            var found = false;
            var params;
            this.each(function(index){
                var cItems = $(this).closest('.ba-box-autocomplete').find('.ba-available-items .list-group-item');
                var cItems2 = $(this).closest('.ba-box-autocomplete').find('.ba-selected-items .list-group-item');
                cItems.add(cItems2);
                cItems.each(function(){
                    params = jQuery.parseJSON($(this).attr('data-ba-value'));
                    if ((settings.valueFormat == "json" && params.value == value) || (settings.valueFormat == "text" && params == value))
                    {
                        found = true;
                        return true;
                    }
                });
                if (found == true)
                    return true;
            });
            return found;
        };

        this.addDataItem = function(iData, iContainer){

            console.log("Add data item function...");
            var max = 1;
            var l;
            var cContainer;
            if (iContainer === undefined)
            {
                max = ba.length;
            }
            console.log("Max = " + max);
            var items = [];
            // Si on n'accepte que des valeurs uniques
            if (settings.uniqueValue === true)
            {
                console.log("Values must be uniques...");
                if (iData === undefined || iData.value === undefined || ba.isValueInData(iData.value))
                {
                    console.log("Return in unique data item..");
                    console.log("Concerned data = " + iData.value);
                    return items;
                }
            }
            for (l = 0; l < max; l++)
            {
                if (iContainer === undefined)
                {
                    cContainer = ba.eq(l).parent().find('.ba-available-items');
                    console.log("container = " + cContainer);
                }
                else
                {
                    cContainer = iContainer;
                }
                var item = settings.getItem(iData, settings.valueFormat);
                // Attaching click event
                console.log("item buttons length = " + item.find('.ba-add').length);
                $(document).on('click', '.ba-add', {
                    'currentAddButton': item.find('.ba-add').eq(0),
                    'cContainer': cContainer,
                    settings: settings
                }, function(e){
                    e.preventDefault();
                    if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentAddButton.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                    {
                        console.log("Data uid = " + $(this).closest('.ba-box-autocomplete').attr('data-ba-uid'));
                        console.log("Real uid needed = " + e.data.currentAddButton.closest('.ba-box-autocomplete').attr('data-ba-uid'));
                        return false;
                    }
                    if ($(this).hasClass('hide'))
                        return false;
                    e.stopImmediatePropagation();
                    console.log("ID = " + $(this).closest('.ba-box-autocomplete').attr('data-ba-uid'));
                    console.log("Click on ADD BUTTON >>>");
                    $(this).toggleClass('hide');
                    var k = $(this).closest('.list-group-item');
                    k.find('.ba-remove').toggleClass('hide');
                    var selected = $(this).closest('.ba-box-autocomplete').find('.ba-selected-items');
                    selected.scrollTop(selected[0].scrollHeight + 50);
                    k.appendTo(selected);
                    e.data.settings.updateInput($(this).closest('.ba-box-autocomplete').find('input:not(.ba-search)'), e.data.settings.valueFormat);
                });

                $(document).on('click', '.ba-remove', {
                    'currentRemoveButton': item.find('.ba-remove').eq(0),
                    'cContainer': cContainer,
                    settings: settings
                },  function(e){
                    e.preventDefault();
                    if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentRemoveButton.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                    {
                        console.log(e.data.currentRemoveButton);
                        return false;
                    }
                    e.stopImmediatePropagation();
                    if ($(this).hasClass('hide'))
                        return false;
                    $(this).toggleClass('hide');
                    var k = $(this).closest('.list-group-item');
                    k.find('.ba-add').toggleClass('hide');
                    k.appendTo($(this).closest('.ba-box-autocomplete').find('.ba-available-items'));
                    e.data.settings.updateInput($(this).closest('.ba-box-autocomplete').find('input:not(.ba-search)'), e.data.settings.valueFormat);
                });
                cContainer.append(item);
                items.push(item);
            }
            return items;
        };

        this.addSelectedItem = function(item)
        {
            var ret = ba.addDataItem(item);
            for (var r in ret)
            {
                ret[r].find('.ba-add').click();
            }
        };


        var readyDataLaunch = function(el)
        {
            // For each input on which we would like to put the box autocomplete
            var selectedContainer;
            var availableContainer;
            var i, j;
            var inputValue;
            el.each(function(){

                // Avoid to be initialised many times
                if ($(this).attr('data-ba') === "1")
                    return true;
                else
                    $(this).attr('data-ba', "1");

                // Begin
                if (settings.hideInput === true)
                    $(this).hide();
                $(this).wrap('<div class="row ba-box-autocomplete"></div>');
                $(this).before('<div class="col-md-6"><ul class="list-group ba-available-items"></ul></div>');
                $(this).before('<div class="col-md-6"><ul class="list-group ba-selected-items"></ul></div>');
                $(this).closest('.ba-box-autocomplete').attr('data-ba-uid', Math.random());
                availableContainer = $(this).parent().find('.ba-available-items');

                // Append the items that can appear in the input value by default
                inputValue = $(this).attr('value');
                if (inputValue !== undefined && settings.valueFormat == "json" && inputValue.length > 0)
                {
                    inputValue = $.parseJSON(inputValue);
                    for (i in inputValue)
                    {
                        var found = false;
                        for (j in settings.data)
                        {
                            if (settings.data[j].value == inputValue[i].value)
                            {
                                settings.data[j].baSelected = true;
                                found = true;
                                break;
                            }
                        }
                        if (found === false)
                        {
                            inputValue[i].baSelected = true;
                            settings.data.push(inputValue[i]);
                        }
                    }
                }

                // Search functionnality
                if (settings.search === true)
                {
                    availableContainer.prepend($('<div class="input-group"><input type="text" class="form-control ba-search" placeholder="'+ settings.searchPlaceholder +'"><span class="input-group-btn"><button class="btn btn-default ba-search-clear" type="button">' + settings.searchButtonText + '</button></span></div>'));
                    var searchInput = availableContainer.find('input.ba-search');

                    $(document).on('click', '.ba-search-clear', {
                        'currentClearButton': searchInput,
                        'settings': settings
                    }, function(e){
                        e.preventDefault();
                        if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentClearButton.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                        {
                            return false;
                        }
                        e.stopImmediatePropagation();
                        $(this).closest('.ba-box-autocomplete').find('input.ba-search').val("");
                        //$(this).attr("value", "")
                        e.data.settings.searchFilterBy($(this).closest(".ba-available-items"), "");
                    });

                    $(document).on('keyup', 'input.ba-search', {
                        'currentInput': searchInput,
                        'settings': settings
                    }, function(e){
                        if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentInput.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                        {
                            return false;
                        }
                        e.stopImmediatePropagation();
                        if ($(this).val().length >= e.data.settings.searchMin)
                        {
                            e.data.settings.searchFilterBy($(this).closest('.ba-available-items'), $(this).val());
                            console.log("Filter by = " + $(this).val());
                        }
                        else
                        {
                            // Reset data list
                            e.data.settings.searchFilterBy($(this).closest(".ba-available-items"), "");
                        }
                    });

                }
                var items;
                for (i in settings.data)
                {
                    console.log(JSON.stringify(settings.data[i]));
                    items = ba.addDataItem(settings.data[i], availableContainer);
                    if (settings.data[i].baSelected === true)
                    {
                        console.log("Must be selected length = " + items.length);
                        console.log("<!!!!!!!!> settings.data[i].name = " + settings.data[i].name);
                        var j;
                        for (j in items)
                        {
                            items[j].find('.ba-add').click();

                        }
                    }
                }
            });

            //Clear the data var
            settings.data = [];
        };

        // Getting the DATA if the dataUrl is set
        if (settings.dataUrl !== false)
        {
            var that = this;
            settings.data = [];
            $.get(settings.dataUrl).then(function(data){
                console.log("Data 2 = " + JSON.stringify(data));
                settings.data = data;
                readyDataLaunch(that);
            });
        }
        else
        {
            readyDataLaunch(this);
        }
        return this;
    };

}( jQuery ));
