using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OSDPayslip.Service.HandlePdf
{
    public interface IHandlePdfService
    {
        bool ConvertHtmlToPdf(int RequestID);
    }
}
