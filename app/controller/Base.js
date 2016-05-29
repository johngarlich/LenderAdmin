/*
 * File: app/controller/Base.js
 *
 * This file was generated by Sencha Architect version 3.0.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('LenderAdmin.controller.Base', {
    extend: 'Ext.app.Controller',

    onStreet2txtBlur: function(component, e, eOpts) {
        var street  = Ext.ComponentQuery.query('field[name=street]')[0].getValue();
        var street2 = Ext.ComponentQuery.query('field[name=street2]')[0].getValue();
        var fullStreet = street + " " + street2;
        Ext.ComponentQuery.query('field[name=fullStreet]')[0].setValue(fullStreet);
    },

    onZipcodetxtBlur: function(component, e, eOpts) {
        var city     = Ext.ComponentQuery.query('field[name=city]')[0].getValue();
        var state    = Ext.ComponentQuery.query('field[name=state]')[0].getValue();
        var zipcode  = Ext.ComponentQuery.query('field[name=zipcode]')[0].getValue();
        var csz      = city + " " + state + " " + zipcode;
        Ext.ComponentQuery.query('field[name=csz]')[0].setValue(csz);
    },

    onClearFieldsbtnClick: function(button, e, eOpts) {

        // clear all of the fields except the stateFiltercbo.  You need to
        // have a value in the stateFiltercbo otherwise you want get any values
        // for lenderIds when you expand the combobox as it is filtered by the state that is chosen
        var value = Ext.ComponentQuery.query('#stateFiltercbo')[0].getValue();
        var form = Ext.ComponentQuery.query('#lendersfrm')[0];
        var selector = "#"+form.itemId + " textfield";
        var myFields = Ext.ComponentQuery.query(selector);
        Ext.Array.forEach(myFields,function(item,index,self){
            item.setValue("");
        });
        Ext.ComponentQuery.query('#stateFiltercbo')[0].setValue(value);
        var store = Ext.getStore('DealerIdsGrid');
        store.removeAll();
    },

    onChangeStatebtnClick: function(button, e, eOpts) {
        // clear mongoId, dealerIds

        Ext.ComponentQuery.query('field[name=dealerIds]')[0].setValue("");
        Ext.ComponentQuery.query('field[name=mongoId]')[0].setValue("");
        Ext.ComponentQuery.query('field[name=mongoIdLD]')[0].setValue("");
        var store = Ext.getStore('DealerIdsGrid');
        store.removeAll();

    },

    onAddDealerIdToDealerIdsGridClick: function(button, e, eOpts) {
        store = Ext.getStore('DealerIdsGrid');
        var dealerId = Ext.ComponentQuery.query('field[name=dealerIds]')[0].getValue();

        store.add({dealerId:dealerId});
    },

    onRemoveDealerFromGridbtnClick: function(button, e, eOpts) {
        var grid = Ext.ComponentQuery.query('#dealersgrd')[0];
        var selections = grid.getSelectionModel().getSelection();

        var store = Ext.getStore('DealerIdsGrid');
        for (i=0;i<selections.length;i++){
            var index = grid.store.indexOf(selections[i]);
            store.removeAt(index);
        }

    },

    onFormTypeFiltercboSelect: function(combo, records, eOpts) {
        var store = Ext.getStore('Forms');
        store.clearFilter();

        store.filter([
            {property:"formType",value:records[0].data.name}
        ]);
    },

    onFormsListgrdSelect: function(rowmodel, record, index, eOpts) {

        var store = Ext.getStore('FormRequirements');
        store.add(record.data);
    },

    onRemoveRequirementbtnClick: function(button, e, eOpts) {
        var store = Ext.getStore('FormRequirements');
        var grid  = Ext.ComponentQuery.query('#requirementsgrd')[0];
        var selected = grid.getSelectionModel().getSelection();
        grid.store.remove(selected);

    },

    init: function(application) {
                // server

                nodeJsService    =      "http://172.31.14.38:2200/";
                socket             = io("http://172.31.14.38:2230");

                /*
                nodeJsService    =      "http://52.27.221.144:2200/";
                socket             = io("http://52.27.221.144:2230");
                */
                // You have several files.
                // There is a lenders file
                // There is a lenderDealer file that has the reserver percentage
                // There is a coreLenderForms file.  This is the key result of this program
                // You put in standard info for the lender.
                // Then you add the reserve, lenderDealer info (which is the lender's DealerId and the reserve percentage)
                // Then you add the coreLenderForms for this lender
                // You can add some more rules as you figure out what each lender needs differently
                // Forms are created in the Forms admin app.  You need to remember that you will need to
                // also load the form in Kevin's admin section so that you can generate guids for the forms




        this.control({
            "#street2txt": {
                blur: this.onStreet2txtBlur
            },
            "#zipcodetxt": {
                blur: this.onZipcodetxtBlur
            },
            "#clearFieldsbtn": {
                click: this.onClearFieldsbtnClick
            },
            "#changeStatebtn": {
                click: this.onChangeStatebtnClick
            },
            "#addDealerIdToDealerIdsGrid": {
                click: this.onAddDealerIdToDealerIdsGridClick
            },
            "#removeDealerFromGridbtn": {
                click: this.onRemoveDealerFromGridbtnClick
            },
            "#formTypeFiltercbo": {
                select: this.onFormTypeFiltercboSelect
            },
            "#formsListgrd": {
                select: this.onFormsListgrdSelect
            },
            "#removeRequirementbtn": {
                click: this.onRemoveRequirementbtnClick
            }
        });
    }

});
