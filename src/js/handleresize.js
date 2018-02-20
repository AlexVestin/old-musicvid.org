

export default function handleResize() {
    var isResizing = false,
    lastDownX = 0;


    $(function () {
        var container = $('.wrapper'), left = $('.sidebar-wrapper'), right = $('.content-wrapper'), handle = $('.content-wrapper #drag-horizontal');

        handle.on('mousedown', function (e) {
            isResizing = true;
            lastDownX = e.clientX;
        });

        $(document).on('mousemove', function (e) {
            // we don't want to do anything if we aren't resizing.
            if (!isResizing) 
                return;
            
            var offsetRight = window.innerWidth - (container.width() - (e.clientX - container.offset().left));
            left.css('width', offsetRight);
        }).on('mouseup', function (e) {
            // stop resizing
            isResizing = false;
        });
    });
}