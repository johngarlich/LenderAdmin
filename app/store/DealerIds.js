/*
 * File: app/store/DealerIds.js
 *
 * This file was generated by Sencha Architect version 3.2.0.
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

Ext.define('LenderAdmin.store.DealerIds', {
    extend: 'Ext.data.Store',

    requires: [
        'LenderAdmin.model.DealerId',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'LenderAdmin.model.DealerId',
            storeId: 'DealerIds',
            proxy: {
                type: 'ajax',
                url: 'data/dealerIds.json',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});