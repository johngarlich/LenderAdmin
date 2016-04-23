/*
 * File: app/controller/MongoCalls.js
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

Ext.define('LenderAdmin.controller.MongoCalls', {
    extend: 'Ext.app.Controller',

    onLenderIdcboSelect: function(combo, records, eOpts) {

        var form = Ext.ComponentQuery.query('#lendersfrm')[0];
        form.getForm().setValues(records[0].data);
        // you have to set the _id field to mongoId
        Ext.ComponentQuery.query('field[name=mongoId]')[0].setValue(records[0].data._id);

        // set the store values for dealerId
        // load the dealerIds into the grid
        var dealers = records[0].data.dealerIds;
        var dealerId  = {};
        var dealerIds = [];
        Ext.Array.forEach(dealers, function(item,index,self){
            dealerId = {
                dealerId:item
            };
            dealerIds.push(dealerId);
        });
        store = Ext.getStore('DealerIdsGrid');
        store.loadData(dealerIds);

        // make a mongo call to get the matching reservePercentage and lendersDealerId if it exists
        this.getReservePercentageAndLendersDealerId();

        //

        var lenderId    = Ext.ComponentQuery.query('#lenderIdcbo')[0].getValue();
        var dealerId    = Ext.ComponentQuery.query('#dealerIdscbo')[0].getValue();
        var lenderState = Ext.ComponentQuery.query('#lenderStatecbo')[0].getValue();
        var financeType = Ext.ComponentQuery.query('#financeTypecbo')[0].getValue();
        Ext.ComponentQuery.query('#lenderIdReq')[0].setValue(lenderId);
        Ext.ComponentQuery.query('#dealerIdReq')[0].setValue(dealerId);
        Ext.ComponentQuery.query('#lenderStateReq')[0].setValue(lenderState);
        Ext.ComponentQuery.query('#financeTypeReq')[0].setValue(financeType);
        this.getLenderFormReqs();



    },

    onUpdatebtnClick: function(button, e, eOpts) {
        // calc updateDoc
        var updateDoc = Ext.ComponentQuery.query('#lendersfrm')[0].getForm().getValues();
        delete updateDoc.mongoIdLD;
        delete updateDoc.reservePercentage;
        delete updateDoc.lendersDealerId;
        delete updateDoc.filterState;
        delete updateDoc.dealerIds;
        delete updateDoc.mongoId;

        var dealerIds = [];
        var store = Ext.getStore('DealerIdsGrid');
        var values = store.data.items;
        Ext.Array.forEach(values, function(item,index,self){
            dealerIds.push(item.data.dealerId);
        });
        updateDoc.dealerIds = dealerIds;
        // calc queryDoc
        var lenderId    = Ext.ComponentQuery.query('field[name=lenderId]')[0].getValue();
        var dealerId    = Ext.ComponentQuery.query('field[name=dealerIds]')[0].getValue();
        var financeType = Ext.ComponentQuery.query('field[name=financeType]')[0].getValue();
        var lenderState = Ext.ComponentQuery.query('field[name=lenderState]')[0].getValue();
        if(!lenderId || !dealerId || !financeType || !lenderState){
            alert('you have to fill out lenderId, dealerId, lenderState and financeType otherwise you cannot save a record');
            return;
        }
        var queryDoc = {
            lenderId   :lenderId,
            financeType:financeType,
            lenderState:lenderState
        };

        // set collectionName
        var collectionName = "lenders";

        // set mongoCall
        var mongoCall = "upsertDoc";

        this.upsertLenderRecord(collectionName,queryDoc,updateDoc,mongoCall);

    },

    onLendersfrmAfterRender: function(component, eOpts) {
        this.getAllLenders();
        //this.getAllForms();
    },

    onStateFiltercboChange: function(field, newValue, oldValue, eOpts) {
        this.getAllLenders();
    },

    onLenderIdcboExpand: function(field, eOpts) {

        this.getAllLenders();
    },

    onDeletebtnClick: function(button, e, eOpts) {
        var mongoId = Ext.ComponentQuery.query('field[name=mongoId]')[0].getValue();
        if(!mongoId){
            alert("you can't delete a record that doesn't exist in mongo");
        }
        else {
            this.deleteLenderRecordById(mongoId,"lenders","deleteDoc");
        }
    },

    onRefreshFormsListbtnClick: function(button, e, eOpts) {
        Ext.ComponentQuery.query('#formTypeFiltercbo')[0].setValue("");
        this.getAllForms();
    },

    onSaveLenderReqsClick: function(button, e, eOpts) {
        var lenderReqs = {};
        var lenderIdReq    = Ext.ComponentQuery.query('field[name=lenderIdReq]')[0].getValue();
        var dealerIdReq    = Ext.ComponentQuery.query('field[name=dealerIdReq]')[0].getValue();
        var lenderStateReq = Ext.ComponentQuery.query('field[name=lenderStateReq]')[0].getValue();
        var financeTypeReq = Ext.ComponentQuery.query('field[name=financeTypeReq]')[0].getValue();
        var mongoIdReq     = Ext.ComponentQuery.query('field[name=mongoIdReq]')[0].getValue();
        var store = Ext.getStore('FormRequirements');
        var values = store.data.items;
        var formReq  = {};
        var formReqs = [];
        Ext.Array.forEach(values, function(item,index,self){

            formReq = {
                "_id"        : item.data._id,
                formCategory : item.data.formCategory,
                formType     : item.data.formType,
                formId       : item.data.formId,
                publicName   : item.data.publicName

            };

            formReqs.push(formReq);
        });

        lenderReqs = {
            lenderId   : lenderIdReq,
            dealerId   : dealerIdReq,
            lenderState: lenderStateReq,
            financeType: financeTypeReq,
            formReqs   : formReqs
        };
        var doc            = lenderReqs;
        var collectionName = "coreLenderForms";
        if (mongoIdReq === ""){
            this.insertDoc(collectionName,doc);
        }
        else {
            this.upsertDocById(collectionName,doc,mongoIdReq);
        }


    },

    onSaveEntireLenderReqsbtnClick: function(button, e, eOpts) {

    },

    getAllLenders: function() {
        var collectionName = "lenders";
        var mongoCall      = "getDocs";
        var lenderState    = Ext.ComponentQuery.query('#stateFiltercbo')[0].getValue();
        var query          = {"lenderState":lenderState};
        var store          = Ext.getStore('Lenders');
        store.removeAll();

        Ext.Ajax.request({
            url: nodeJsService + "collection/" + mongoCall,
            success: function(response,err){
                var docsArray = JSON.parse(response.responseText);
                store = Ext.getStore("Lenders");
                Ext.Array.forEach(docsArray,function(item,index,self){
                    store.add(item);
                });
            },
            failure: function(response,err){
                alert("wasn't able to get docs from collection " + collectionName);
            },
            method: 'GET',
            params: {
                "query"      :JSON.stringify(query),
                "collectionS":collectionName
            }
        });

    },

    getAllForms: function() {
        var collectionName = "forms";
        var query          = {};
        query              = JSON.stringify(query);

        var store          = Ext.getStore('Forms');
        store.removeAll();
        this.getAllDocs(collectionName,query,store);

    },

    getAllDocs: function(collectionName, query, store) {
        scope = this;
        Ext.Ajax.request({
            url: nodeJsService + "collection/getDocs",
            success: function(response,err){
                var docsArray = JSON.parse(response.responseText);

                store.clearFilter();
                store.loadData(docsArray);
            },
            failure: function(response,err){
                alert("wasn't able to get docs from collection " + collectionName);
            },
            method: 'GET',
            params: {
                "query"      :query,
                "collectionS":collectionName
            }
        });

    },

    getDocById: function(collectionName, mongoId, store) {
        var scope = this;

        Ext.Ajax.request({
            url: nodeJsService + "collection/getDocById",
            success: function(response,err){
                if (response.responseText=="false"){
                    alert("did not get the document from " + collectionName);

                }
                else {
                    debugger;
                    var docs = JSON.parse(response.responseText);
                    var doc  = docs[0];

                    store.add(doc);
                }
            },
            failure: function(response,err){
                alert("Did not get doc from " + collectionName);
            },
            method: 'GET',
            params: {
                "collectionS":collectionName,
                "mongoId"    :mongoId
            }
        });
    },

    getDocsByIds: function(collectionName, mongoIds, store) {
        var scope = this;

        Ext.Ajax.request({
            url: nodeJsService + "collection/getDocById",
            success: function(response,err){
                debugger;
                if (JSON.parse(response.responseText).error){
                    alert("did not get the document from " + collectionName);

                }
                else {

                    var docs = (JSON.parse(response.responseText).result);

                    store.add(docs);
                }
            },
            failure: function(response,err){
                alert("Did not get doc from " + collectionName);
            },
            method: 'GET',
            params: {
                "collectionS":collectionName,
                "mongoId"    :JSON.stringify(mongoIds)
            }
        });
    },

    getReservePercentageAndLendersDealerId: function() {
        var collectionName = "lenderDealer";
        var mongoCall      = "getDocs";
        // create query
        var dealerId       = Ext.ComponentQuery.query('field[name=dealerIds]')[0].getValue();
        var lenderId       = Ext.ComponentQuery.query('field[name=lenderId]')[0].getValue();
        var financeType    = Ext.ComponentQuery.query('field[name=financeType]')[0].getValue();
        var query          = {"dealerId":dealerId,"lenderId":lenderId,"financeType":financeType};

        Ext.Ajax.request({
            url: nodeJsService + "collection/" + mongoCall,
            success: function(response,err){
                var docsArray = JSON.parse(response.responseText);

                var doc = docsArray[0];
                if(Ext.isDefined(doc)){
                    Ext.ComponentQuery.query('field[name=reservePercentage]')[0].setValue(doc.reservePercentage);
                    Ext.ComponentQuery.query('field[name=lendersDealerId]')[0].setValue(doc.lendersDealerId);
                    Ext.ComponentQuery.query('field[name=mongoIdLD]')[0].setValue(doc._id);

                }
                else {

                    Ext.ComponentQuery.query('field[name=reservePercentage]')[0].setValue("");
                    Ext.ComponentQuery.query('field[name=lendersDealerId]')[0].setValue("");
                    Ext.ComponentQuery.query('field[name=mongoIdLD]')[0].setValue("");
                    alert('there is no lenderDealer record matching this lender');
                }
            },
            failure: function(response,err){
                alert("wasn't able to get docs from collection " + collectionName);
            },
            method: 'GET',
            params: {
                "query"      :JSON.stringify(query),
                "collectionS":collectionName
            }
        });

    },

    insertDoc: function(collectionName, doc) {
        var scope = this;
        Ext.Ajax.request({
            url: nodeJsService + "collection/insertDoc",
            success: function(response,err){

                if(response.responseText === false){
                    alert('no insert');
                }
                else {
                    var insertedDoc = JSON.parse(response.responseText);
                    var mongoIdReq  = insertedDoc._id;
                    Ext.ComponentQuery.query('field[name=mongoIdReq]')[0].setValue(mongoIdReq);
                }

            },
            failure: function(response,err){
                alert("No insert");
            },
            method: 'POST',
            params: {
                "collectionS":collectionName,
                "doc"        :JSON.stringify(doc)
            }
        });
    },

    upsertDocById: function(collectionName, updateDoc, mongoId) {
        var scope = this;
        Ext.Ajax.request({
            url: nodeJsService + "collection/upsertDocById",
            success: function(response,err){
                if(response.responseText === false){
                    alert('no upsert');
                }
                else {
                    var upsertedDoc = JSON.parse(response.responseText);
                    var mongoId     = response.request.options.params.mongoId;

                    switch(collectionName){
                        case "coreLenderForms":
                            alert('upserted coreLenderForms by Id');
                            Ext.ComponentQuery.query('field[name=mongoIdReq]')[0].setValue(mongoId);
                            break;
                        case "lenders":
                             alert('upserted lender by Id');
                            Ext.ComponentQuery.query('field[name=mongoId]')[0].setValue(mongoId);
                            break;
                        case "lenderDealer":
                             alert('upserted lenderDealer by Id');
                            Ext.ComponentQuery.query('field[name=mongoIdLD]')[0].setValue(mongoId);
                            break;
                    }

                }
            },
            failure: function(response,err){
                alert("No upsert");
            },
            method: 'POST',
            params: {
                "collectionS":collectionName,
                "updateDoc"  :JSON.stringify(updateDoc),
                "mongoId"    :mongoId
            }
        });
    },

    upsertLenderRecord: function(collectionName, queryDoc, updateDoc) {
        var scope = this;
        Ext.Ajax.request({
            url: nodeJsService + "collection/upsertDoc",
            success: function(response,err){

                if(response.responseText === false){
                    alert('no upsert');
                }
                else {
                    //upsert the lenderDealerRecord
                    alert('upserted Lender Record');
                    scope.upsertLenderDealerRecord();
                }

            },
            failure: function(response,err){
                alert("No upsert");
            },
            method: 'POST',
            params: {
                "collectionS":collectionName,
                "updateDoc"  :JSON.stringify(updateDoc),
                "queryDoc"   :JSON.stringify(queryDoc)
            }
        });
    },

    upsertLenderDealerRecord: function() {
        var collectionName = "lenderDealer";
        var mongoCall      = "upsertDoc";
        var dealerId       = Ext.ComponentQuery.query('field[name=dealerIds]')[0].getValue();
        var lenderId       = Ext.ComponentQuery.query('field[name=lenderId]')[0].getValue();
        var financeType    = Ext.ComponentQuery.query('field[name=financeType]')[0].getValue();
        var query          = {"dealerId":dealerId,"lenderId":lenderId,"financeType":financeType};

        var updateDoc = {
            lenderId:lenderId,
            financeType:financeType,
            dealerId:dealerId,
            reservePercentage:Ext.ComponentQuery.query("field[name=reservePercentage]")[0].getValue(),
            lendersDealerId  :Ext.ComponentQuery.query("field[name=lendersDealerId]")[0].getValue()
        };

        Ext.Ajax.request({
            url: nodeJsService + "collection/" + mongoCall,
            success: function(response,err){

                if(response.responseText === false){
                    alert('no upsert of '+collectionName);
                }
                else {
                    alert("upserted the lenderDealerRecord");
                }

            },
            failure: function(response,err){
                alert("wasn't able to upsert the lenderDealer record");
            },
            method: 'POST',
            params: {
                "queryDoc"   :JSON.stringify(query),
                "collectionS":collectionName,
                "updateDoc"  :JSON.stringify(updateDoc)
            }
        });

    },

    deleteLenderRecordById: function(mongoId, collectionName) {
        var scope = this;
        Ext.Ajax.request({
            url: nodeJsService + "collection/deleteDocById",
            success: function(response,err){
                if(response.responseText===true){
                    alert('deleted Lender Record from this state');
                }
            },
            failure: function(response,err){
                alert("wasn't able to delete doc from collection: " + collectionName);
            },
            method: 'GET',
            params: {
                "mongoId"    :mongoId,
                "collectionS":collectionName
            }
        });
    },

    getLenderFormReqs: function() {
        var collectionName = "coreLenderForms";

        var lenderState    = Ext.ComponentQuery.query('field[name=lenderState]')[0].getValue();
        var lenderId       = Ext.ComponentQuery.query('field[name=lenderId]')[0].getValue();
        var dealerId       = Ext.ComponentQuery.query('field[name=dealerIds]')[0].getValue();
        var financeType    = Ext.ComponentQuery.query('field[name=financeType]')[0].getValue();
        var query          = {lenderState:lenderState, lenderId:lenderId, dealerId:dealerId, financeType:financeType};
        var store          = Ext.getStore('FormRequirements');
        var coreReqs       = [];
        var coreReq        = {};
        store.removeAll();
        scope = this;
        debugger;
        Ext.Ajax.request({
            url: nodeJsService + "collection/getDocs",
            success: function(response,err){
                var docs = JSON.parse(response.responseText);
                if(docs.length===0){
                    // set mongoIdReqs to ""
                    Ext.ComponentQuery.query('field[name=mongoIdReq]')[0].setValue("");
                }
                else {
                    var doc  = docs[0];
                    Ext.ComponentQuery.query('field[name=mongoIdReq]')[0].setValue(doc._id);
                    //store.loadData(doc.formReqs);
                    Ext.Array.each(doc.formReqs, function(item,index,self){
                        coreReq = {
                            _id:item._id,
                            formCategory:item.formCategory,
                            formType:item.formType,
                            formId:item.formId,
                            publicName:item.publicName
                        };
                        coreReqs.push(coreReq);
                    });
                    store.loadData(coreReqs);
                }

            },
            failure: function(response,err){
                alert("wasn't able to get docs from collection " + collectionName);
            },
            method: 'GET',
            params: {
                "query"      :JSON.stringify(query),
                "collectionS":collectionName
            }
        });

    },

    getFormRequirementsFromFormsCollection: function(mongoIds) {
        var collectionName = "forms";
        var store = Ext.getStore("FormRequirements");
        var me = this;
        Ext.Array.each(mongoIds,function(item,index,self){
            debugger;
           me.getDocById(collectionName,item,store);
        });

    },

    init: function(application) {
        this.control({
            "#lenderIdcbo": {
                select: this.onLenderIdcboSelect,
                expand: this.onLenderIdcboExpand
            },
            "#updatebtn": {
                click: this.onUpdatebtnClick
            },
            "#lendersfrm": {
                afterrender: this.onLendersfrmAfterRender
            },
            "#stateFiltercbo": {
                change: this.onStateFiltercboChange
            },
            "#deletebtn": {
                click: this.onDeletebtnClick
            },
            "#refreshFormsListbtn": {
                click: this.onRefreshFormsListbtnClick
            },
            "#saveLenderReqs": {
                click: this.onSaveLenderReqsClick
            },
            "#saveEntireLenderReqsbtn": {
                click: this.onSaveEntireLenderReqsbtnClick
            }
        });
    }

});
