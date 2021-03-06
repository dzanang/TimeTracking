﻿using Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{

    public class ListTeamsModel
    {

        public ListTeamsModel()
        {
            Details = new List<ListModel>();
            Days = new List<ListModel>();
            Members = new List<CountModel>();
            DeadlineIn = new List<DeadlineModel>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public IList<ListModel> Days { get; set; }        
        public IList<ListModel> Details { get; set; }
        public IList<CountModel> Members { get; set; }
        public IList<DeadlineModel> DeadlineIn { get; set; }

    }
}