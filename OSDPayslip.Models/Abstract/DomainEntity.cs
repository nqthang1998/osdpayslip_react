using System.ComponentModel.DataAnnotations;

namespace OSDPayslip.Models.Abstract
{
    public class DomainEntity<T>: Auditable
    {
        [Key]
        public T Id { get; set; }

        public bool IsTransient()
        {
            return Id.Equals(default(T));
        }
    }
}