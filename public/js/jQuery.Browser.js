(function (BOM, DOM, $) {

    var URL_Object = BOM.webkitURL || BOM.URL || BOM;

    $.fn.xImage = function (Type_Filter) {
        var $_This = this.find('*').addBack().filter('input[type="file"]');
        Type_Filter = Type_Filter || [ ];

        $_This.parent().css({
            position:    'relative',
            cursor:      'pointer'
        });
        $_This
            .css({
                position:     'absolute',
                'z-index':    999,
                opacity:      0
            })
            .each(function () {
                var $_This = $(this);
                var $_PreView = $_This.siblings('img, img.PreView').eq(0);
                if (! $_PreView.length)
                    $_PreView = $('<img />').before($_This);

                $_PreView.addClass('PreView').css({
                    display:          'inline-block',
                    'max-height':     $(top).height() * (1 / 3),
                    'max-width':      $(top).width() * (1 / 3)
                })
                    .on('Ready',  function () {
                        $_This.css({
                            top:       $_PreView.position().top,
                            left:      $_PreView.position().left,
                            width:     $_PreView.width(),
                            height:    $_PreView.height()
                        });
                    }).trigger('Ready').on('load',  function () {
                        $_PreView.trigger('Ready');
                    });
            })
            .data('clicks', 0).click(function () {
                var $_This = $(this);
                var Click_Times = $_This.data('clicks');

                if ($.browser.mobile && (++Click_Times > 3)) {
                    BOM.alert("����ǰ��������޷��ڱ�ҳ�ϴ��ļ�����");
                    return false;
                }
                $_This.data('clicks', Click_Times);
            })
            .change(function () {
                var $_This = $(this).data('clicks', 0);

                try {
                    var iFile = arguments[0].target.files[0];
                } catch (iError) {
                    BOM.alert([
                        "����ǰ ������ں� ��Ϊ���ϣ��ݲ�֧�֡�ͼƬ�ϴ�Ԥ��������",
                        "�������Ϊ���°� �ѹ����Ա������� ��˫�������~"
                    ].join("\n\n"));

                    $_This.show().siblings('img.PreView').remove();

                    return true;
                }

                var iType = iFile.type.split('/');
                if (iType[0] != 'image') {
                    BOM.alert("����ѡ���ļ�����ͼƬ����");
                    return false;
                } else if ($.inArray(iType[1], Type_Filter) > -1) {
                    BOM.alert([
                        "�˴������ϴ�", iType[1].toUpperCase(), "��ʽ��ͼƬ��"
                    ].join(' '));
                    return false;
                }

                var iReader = new FileReader();
                iReader.onload = function () {
                    $_This.siblings().not('img.PreView, input[type="file"]').hide();

                    var $_PreView = $_This.siblings('img.PreView');
                    $_PreView[0].onload = function () {
                        URL_Object.revokeObjectURL(this.src);
                    };
                    $_PreView[0].src = URL_Object.createObjectURL(iFile);
                };
                iReader.readAsBinaryString(iFile);
            });

        return this;
    };

})(self,  self.document,  self.jQuery);