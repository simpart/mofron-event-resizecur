/**
 * @file mofron-event-resizecur/index.js
 * @brief resize cursor event for mofron component
 * @license MIT
 */
const MouseMove = require('mofron-event-mousemove');
const comutl = mofron.util.common;

module.exports = class extends mofron.class.Event {
    /**
     * initialize event
     * 
     * @param (mixed) short-form parameter
     *                key-value: event config
     * @short
     * @type private
     */
    constructor (prm) {
        try {
            super();
            this.modname("Resizecur");
            
            this.confmng().add('last_cur', { type:'string' });
            this.confmng().add('mouse_pos', { type:'object', init:{ side:null, vert:null } });
            this.confmng().add('cursor_flag', { type:'boolean', init:true });
	    this.confmng().add('offset', { type:'number', init:5 });

	    if (undefined !== prm) {
                this.config(prm);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    /**
     * event contents
     * 
     * @param (mofron.class.dom) target dom object
     * @type private
     */
    contents (tgt_dom) {
        try {
	    let thisobj = this;
            mofron.window.event(
                new MouseMove((m1,m2,m3) => { thisobj.checkResize(m1,m2,thisobj); })
            );
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    checkResize (c1,c2,c3) {
        try {
            if (true === this.suspend()) {
                return;
            }

            let comp_pos = {
                'top': comutl.getsize(this.component().style('top')).toPixel(),
                'left': comutl.getsize(this.component().style('left')).toPixel()
            }
            let comp_siz = {
                'width': comutl.getsize(this.component().width()).toPixel(),
                'height': comutl.getsize(this.component().height()).toPixel()
            }
            
	    let mouse_pos = {};
            /* check side */
            let chk_side = null;
            if ( ((comp_pos.left-this.offset())<c2.pageX) &&
	         ((comp_pos.left+this.offset())>c2.pageX)) {
                chk_side = 'left';
            } else if ( ((comp_pos.left-this.offset()+comp_siz.width)<c2.pageX) &&
	                ((comp_pos.left+this.offset()+comp_siz.width)>c2.pageX) ) {
                chk_side = 'right';
            }
            mouse_pos.side = chk_side;
            
            /* check vertical */
            let chk_vert = null;
            if ( ((comp_pos.top-this.offset())<c2.pageY) &&
	         ((comp_pos.top+this.offset())>c2.pageY)) {
                chk_vert = 'top';
            } else if ( ((comp_pos.top-this.offset()+comp_siz.height)<c2.pageY) &&
	                ((comp_pos.top+this.offset()+comp_siz.height)>c2.pageY) ) {
                chk_vert = 'bottom';
            }
	    mouse_pos.vert = chk_vert;
            this.confmng('mouse_pos', mouse_pos);

            /* set cursor */
            let set_cursor = null;
            if ((null !== chk_side) && (null === chk_vert)) {
                set_cursor = 'ew-resize';
            } else if ((null === chk_side) && (null !== chk_vert)) {
                set_cursor = 'ns-resize';
            } else if ((null !== chk_side) && (null !== chk_vert)) {
                if ( (('left' === chk_side)&&('top' === chk_vert)) ||
                     (('right' === chk_side)&&('bottom'===chk_vert)) ) {
                    set_cursor = 'nwse-resize';
                } else {
                    set_cursor = 'nesw-resize';
                }
            } else {
	        set_cursor = 'default';
            }
            
            if (true === this.confmng('cursor_flag')) {
                document.body.style.cursor = set_cursor;
	    }

	    if (this.confmng('last_cur') !== set_cursor) {
                this.execListener(set_cursor);
		this.confmng('last_cur', set_cursor);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    disableCursor () {
        try {
            return this.confmng('cursor_flag', false);
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    enableCursor () {
        try {
            return this.confmng('cursor_flag', true);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    offset (prm) {
        try {
            return this.confmng('offset',prm);
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    mousePos (prm) {
        try {
            return this.confmng('mouse_pos', prm);
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    suspend (prm) {
        try {
	    if (true === prm) {
                this.confmng('mouse_pos', { side:null, vert:null });
	    }
            return super.suspend(prm);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

}
/* end of file */
