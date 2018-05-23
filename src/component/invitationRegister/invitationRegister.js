import "../../utils/main750";
import "../../styles/base.css";
import "../../styles/mobile.css";
import "./invitationRegister.css";

import { baseUrl,oGetVars } from "../../utils/host";
import { loadingHide,lazOpen,lazNoting }  from "../../utils/loading";

var controller = (function ($, window, document) {
    
            // －－－－－－－－统一释放的方法－－－－－－－－－－－
            var doInit = function () {
                loadingHide()
            };
            return {
                doInit: doInit
            }
            
    })($, window, document);
    
    $(function () {
        controller.doInit();
    });